import { Module } from '@nestjs/common';
import { ServiceAccountController } from './service-account.controller';
import { ServiceAccountService } from './service-account.service';
import { AddressService } from '../address/address.service';

@Module({
  controllers: [ServiceAccountController],
  providers: [ServiceAccountService, AddressService],
})
export class ServiceAccountModule {}
