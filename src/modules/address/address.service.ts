import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateAddressDto } from './dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async createAddress(addressDto: CreateAddressDto, userId: string) {
    return this.prisma.address.create({
      data: {
        ...addressDto,
        type: 'mailing',
        created_by: userId,
        modified_by: userId,
      },
    });
  }

  //   async findAllAddresses() {
  //     return this.prisma.address.findMany();
  //   }

  //   async findAddressById(id: string) {
  //     const address = await this.prisma.address.findUnique({
  //       where: { id },
  //     });

  //     if (!address) {
  //       throw new NotFoundException(`Address with ID ${id} not found`);
  //     }

  //     return address;
  //   }

  //   async updateAddress(id: string, addressDto: AddressDto) {
  //     const address = await this.prisma.address.update({
  //       where: { id },
  //       data: addressDto,
  //     });

  //     if (!address) {
  //       throw new NotFoundException(`Address with ID ${id} not found`);
  //     }

  //     return address;
  //   }

  //   async deleteAddress(id: string) {
  //     const address = await this.prisma.address.delete({
  //       where: { id },
  //     });

  //     if (!address) {
  //       throw new NotFoundException(`Address with ID ${id} not found`);
  //     }

  //     return address;
  //   }
}
