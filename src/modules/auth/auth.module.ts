import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { CognitoService } from '../cognito';
import { UserService } from '../user';
import { RoleService } from '../role';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    CognitoService,
    UserService,
    RoleService,
  ],
})
export class AuthModule {}
