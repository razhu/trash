import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CognitoService } from '../cognito';

@Module({
  controllers: [UserController],
  providers: [UserService, CognitoService],
  exports: [UserService],
})
export class UserModule {}
