import { Test, TestingModule } from '@nestjs/testing';
import { LegalController } from './legal.controller';
import { LegalService } from './legal.service';
import { TermsAndConditionsResponseDto } from './dto';

// Mock data
const mockTerms: TermsAndConditionsResponseDto = {
  id: 1,
  content: 'Mock Terms and Conditions',
  version: 1,
};

describe('LegalController', () => {
  let controller: LegalController;
  let legalService: LegalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegalController],
      providers: [
        {
          provide: LegalService,
          useValue: {
            getTermsAndConditions: jest.fn(), // Mock the getTermsAndConditions method
          },
        },
      ],
    }).compile();

    controller = module.get<LegalController>(LegalController);
    legalService = module.get<LegalService>(LegalService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return terms and conditions', async () => {
    // Mock the service's getTermsAndConditions return value
    (legalService.getTermsAndConditions as jest.Mock).mockResolvedValue(
      mockTerms,
    );

    const result = await controller.getTermsAndConditions();

    // Verify that the service was called
    expect(legalService.getTermsAndConditions).toHaveBeenCalled();

    // Verify the result is what we expect
    expect(result).toEqual(mockTerms);
  });

  it('should return null if no terms and conditions are found', async () => {
    // Mock the service to return null
    (legalService.getTermsAndConditions as jest.Mock).mockResolvedValue(null);

    const result = await controller.getTermsAndConditions();

    // Verify the service was called
    expect(legalService.getTermsAndConditions).toHaveBeenCalled();

    // Verify the result is null
    expect(result).toBeNull();
  });
});
