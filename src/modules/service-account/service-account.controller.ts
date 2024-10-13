import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { ServiceAccountService } from './service-account.service';
import {
  CreateServiceAccountDto,
  // UpdateServiceAccountDto,
  ServiceAccountResponseDto,
} from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators';
import { User as UserType } from '@prisma/client';

@ApiTags('Service Accounts')
@Controller('service-accounts')
export class ServiceAccountController {
  constructor(private readonly serviceAccountService: ServiceAccountService) {}

  @Post()
  @ApiResponse({
    type: ServiceAccountResponseDto,
  })
  async createServiceAccount(
    @Body() createServiceAccountDto: CreateServiceAccountDto,
    @User() user: UserType,
  ): Promise<ServiceAccountResponseDto> {
    return this.serviceAccountService.createServiceAccount(
      createServiceAccountDto,
      user.id,
    );
  }

  // @Get()
  // @ApiResponse({
  //   type: [ServiceAccountResponseDto],
  // })
  // async findAllServiceAccounts(): Promise<ServiceAccountResponseDto[]> {
  //   return this.serviceAccountService.findAllServiceAccounts();
  // }

  // @Get(':id')
  // @ApiResponse({
  //   type: ServiceAccountResponseDto,
  // })
  // async findServiceAccountById(
  //   @Param('id') id: string,
  // ): Promise<ServiceAccountResponseDto> {
  //   return this.serviceAccountService.findServiceAccountById(id);
  // }

  // @Patch(':id')
  // @ApiResponse({
  //   type: ServiceAccountResponseDto,
  // })
  // async updateServiceAccount(
  //   @Param('id') id: string,
  //   @Body() updateServiceAccountDto: UpdateServiceAccountDto,
  // ): Promise<ServiceAccountResponseDto> {
  //   return this.serviceAccountService.updateServiceAccount(
  //     id,
  //     updateServiceAccountDto,
  //   );
  // }
}
