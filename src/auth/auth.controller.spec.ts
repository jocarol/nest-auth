import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user/user.module';
import { AppModule } from '../app.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../models/user.schema';
import { AuthModule } from './auth.module';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService],
      controllers: [AuthController],
      imports: [AppModule, AuthModule, MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
