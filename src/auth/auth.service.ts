import { Injectable } from '@nestjs/common';
import { Payload } from 'src/types/payload';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  
  constructor(
    private userService: UserService,
    private configService: ConfigService
    ) { }
  
  async signPayload(payload: Payload) {
    console.log('env from auth service', this.configService.get<string>('SECRET_KEY'))
    return sign(payload, "coucoulol", { expiresIn: '7d' });
  }
}