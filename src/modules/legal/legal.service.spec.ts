import { Test, TestingModule } from '@nestjs/testing';
import { LegalService } from './legal.service';
import { PrismaService } from '../prisma';
import { TermsAndConditionsResponseDto } from './dto';

describe('LegalService', () => {
  let service: LegalService;
  let prismaService: PrismaService;

  const mockTerms = {
    id: 1,
    content: { text: 'Test terms and conditions' },
    version: 1,
    created_at: new Date('2023-01-01T00:00:00Z'),
    modified_at: new Date('2023-01-02T00:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegalService,
        {
          provide: PrismaService,
          useValue: {
            termsAndConditions: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LegalService>(LegalService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the latest terms and conditions', async () => {
    jest
      .spyOn(prismaService.termsAndConditions, 'findFirst')
      .mockResolvedValue(mockTerms);

    const result: TermsAndConditionsResponseDto =
      await service.getTermsAndConditions();

    expect(prismaService.termsAndConditions.findFirst).toHaveBeenCalledWith({
      orderBy: { version: 'desc' },
    });
    expect(result).toEqual({
      id: mockTerms.id,
      content: mockTerms.content,
      version: mockTerms.version,
    });
  });

  it('should return null if no terms and conditions are found', async () => {
    jest
      .spyOn(prismaService.termsAndConditions, 'findFirst')
      .mockResolvedValue(null);

    const result = await service.getTermsAndConditions();

    expect(prismaService.termsAndConditions.findFirst).toHaveBeenCalledWith({
      orderBy: { version: 'desc' },
    });
    expect(result).toBeNull();
  });
});
