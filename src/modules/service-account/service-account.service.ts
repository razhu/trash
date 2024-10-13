import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { AddressService } from '../address'; // Import AddressService
import {
  CreateServiceAccountDto,
  UpdateServiceAccountDto,
  ServiceAccountResponseDto,
} from './dto';

@Injectable()
export class ServiceAccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly addressService: AddressService,
  ) {}

  async createServiceAccount(
    createServiceAccountDto: CreateServiceAccountDto,
    userId: string,
  ): Promise<ServiceAccountResponseDto> {
    const { address, ...serviceAccountData } = createServiceAccountDto;

    // Create the address using AddressService
    const createdAddress = await this.addressService.createAddress(
      address,
      userId,
    );

    // Create the service account with the created address id
    const serviceAccount = await this.prisma.serviceAccount.create({
      data: {
        ...serviceAccountData,
        address_id: createdAddress.id,
        created_by: userId,
        modified_by: userId,
      },
      include: { address: true }, // Include the address in the response
    });

    // Return the mapped ServiceAccountResponseDto
    return serviceAccount;
    // return {
    //   ...serviceAccount,
    //   address: createdAddress, // Include the full address object
    // };
  }

  // async findAllServiceAccounts(): Promise<ServiceAccountResponseDto[]> {
  //   const serviceAccounts = await this.prisma.serviceAccount.findMany({
  //     include: { address: true }, // Include address in the response
  //   });

  //   // Map the Prisma result to the DTO format
  //   return serviceAccounts.map((serviceAccount) => ({
  //     ...serviceAccount,
  //     address: serviceAccount.address,
  //   }));
  // }

  // async findServiceAccountById(id: string): Promise<ServiceAccountResponseDto> {
  //   const serviceAccount = await this.prisma.serviceAccount.findUnique({
  //     where: { id },
  //     include: { address: true }, // Include address in the response
  //   });

  //   if (!serviceAccount) {
  //     throw new NotFoundException(`Service account with ID ${id} not found`);
  //   }

  //   // Return the mapped ServiceAccountResponseDto
  //   return {
  //     ...serviceAccount,
  //     address: serviceAccount.address, // Include the full address object
  //   };
  // }

  // async updateServiceAccount(
  //   id: string,
  //   updateServiceAccountDto: UpdateServiceAccountDto,
  // ): Promise<ServiceAccountResponseDto> {
  //   const { address, ...serviceAccountData } = updateServiceAccountDto;

  //   if (address) {
  //     // Update the address using AddressService if provided
  //     await this.addressService.updateAddress(id, address);
  //   }

  //   const serviceAccount = await this.prisma.serviceAccount.update({
  //     where: { id },
  //     data: serviceAccountData,
  //     include: { address: true }, // Include address in the response
  //   });

  //   if (!serviceAccount) {
  //     throw new NotFoundException(`Service account with ID ${id} not found`);
  //   }

  //   // Return the mapped ServiceAccountResponseDto
  //   return {
  //     ...serviceAccount,
  //     address: serviceAccount.address, // Include the full address object
  //   };
  // }
}
