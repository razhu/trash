import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LoggingMiddleware } from './common/middlewares';
import { PrismaModule } from './modules/prisma';
import { AuthModule } from './modules/auth';
import { LegalModule } from './modules/legal';
import { UserModule } from './modules/user';
import { VehicleModule } from './modules/vehicle';
import { ServiceAccountModule } from './modules/service-account';
import { AddressModule } from './modules/address';
import { RoleModule } from './modules/role';
import { CognitoModule } from './modules/cognito';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CognitoModule,
    LegalModule,
    PrismaModule,
    RoleModule,
    UserModule,
    VehicleModule,
    ServiceAccountModule,
    AddressModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
