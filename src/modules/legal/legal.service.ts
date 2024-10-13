import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { TermsAndConditionsResponseDto } from './dto';

@Injectable()
export class LegalService {
  constructor(private readonly prisma: PrismaService) {}

  async getTermsAndConditions(): Promise<TermsAndConditionsResponseDto> {
    const latestTerms = await this.prisma.termsAndConditions.findFirst({
      orderBy: {
        version: 'desc',
      },
    });

    if (!latestTerms) {
      return null;
    }

    return {
      id: latestTerms.id,
      content: latestTerms.content,
      version: latestTerms.version,
    };
  }
}
