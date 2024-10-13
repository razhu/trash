import { PrismaService } from '../../src/modules/prisma';
import { vehicles } from '../constants';

export const seedVehicles = async (prisma: PrismaService) => {
  for (const vehicle of vehicles) {
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        make_model_year: {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
        },
      },
    });

    if (!existingVehicle) {
      await prisma.vehicle.create({
        data: vehicle,
      });
      console.log(
        `Vehicle ${vehicle.make} ${vehicle.model} ${vehicle.year} seeded`,
      );
    } else {
      console.log(
        `Vehicle ${vehicle.make} ${vehicle.model} ${vehicle.year} already exists`,
      );
    }
  }
};
