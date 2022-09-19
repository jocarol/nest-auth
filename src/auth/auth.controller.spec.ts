import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest'

import { AppModule } from '../app.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from '../models/user.schema';
import { AuthModule } from './auth.module';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let authController: AuthController;
  let app: INestApplication;
  let newUserResponse: request.Response;
  const newUserEmail: String = `${Math.random().toString(36).slice(2, 7)}@test.com`

  beforeAll(async () => {
    const controllerTestModule: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService],
      controllers: [AuthController],
      imports: [AppModule, AuthModule, MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    }).compile();

    app = controllerTestModule.createNestApplication();
    app.init()
    authController = controllerTestModule.get<AuthController>(AuthController);
    newUserResponse = await request(app.getHttpServer()).post(`${process.env.REGISTER_ROUTE}`).send({
      email: newUserEmail,
      password: '123'
    })
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it(`should returns HTTP code '200' when reaching a non-JWT guarded controller route while not being logged in`, () => {
    return request(app.getHttpServer()).get(`/auth/anyone`).expect(200)
  })

  it(`should returns HTTP code '200' when reaching a JWT guarded controller route while being logged in`, () => {
    return request(app.getHttpServer()).get(`/auth/onlyauth`).set('Authorization', `Bearer ${newUserResponse.body.token}`).expect(200)
  })

  it(`should returns HTTP code '401' when reaching a JWT guarded controller route while not being logged in`, () => {
    return request(app.getHttpServer()).get(`/auth/onlyauth`).expect(401)
  })

  it(`should returns HTTP code '201' when performing a POST request to '${process.env.REGISTER_ROUTE}' with email & password in the body, to register a user`, () => {
    expect(newUserResponse.status).toEqual(201)
  })

  it(`should returns HTTP code '200' to login with the registered account`, () => {
    return request(app.getHttpServer()).post(`${process.env.LOGIN_ROUTE}`).send({
      email: newUserEmail,
      password: '123',
    })
  })
})
