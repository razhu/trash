import { PrismaService } from '../../src/modules/prisma';
import { termsAndConditions } from '../constants';

export const seedTermsAndConditions = async (prisma: PrismaService) => {
  const existingTerms = await prisma.termsAndConditions.findUnique({
    where: {
      version: 1,
    },
  });

  if (!existingTerms) {
    await prisma.termsAndConditions.create({
      data: {
        content: termsAndConditions,
        version: 1,
      },
    });
    console.log('Terms and conditions seeded');
  } else {
    console.log('Terms and conditions seed data already exists');
  }
};
