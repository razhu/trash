import { Injectable } from '@nestjs/common';
import { GetVehiclesResponseDto } from './dto';
import { PrismaService } from '../prisma';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async getVehicles(): Promise<GetVehiclesResponseDto[]> {
    const vehicles = await this.prisma.vehicle.findMany();

    return vehicles.map((vehicle) => {
      return {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
      };
    });
  }
}
