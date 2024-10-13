import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma';
import { seedRolePermissions } from './seed/seedRolePermissions';
import { seedTermsAndConditions } from './seed/seedTermsAndConditions';
import { seedVehicles } from './seed/seedVehicles';
import { createAdminUser } from './seed/seedAdmin';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  try {
    await seedRolePermissions(prisma);
    await seedTermsAndConditions(prisma);
    await seedVehicles(prisma);
    await createAdminUser(prisma);
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => console.log('Seeding completed successfully.'))
  .catch((error) => console.error('Seeding failed:', error));
