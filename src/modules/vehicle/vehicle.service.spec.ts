import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { PrismaService } from '../prisma';
import { GetVehiclesResponseDto } from './dto';

describe('VehicleService', () => {
  let service: VehicleService;
  let prismaService: PrismaService;

  const mockVehicles = [
    { id: 1, make: 'Toyota', model: 'Corolla', year: 2020 },
    { id: 2, make: 'Honda', model: 'Civic', year: 2021 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: PrismaService,
          useValue: {
            vehicle: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return vehicles', async () => {
    (prismaService.vehicle.findMany as jest.Mock).mockResolvedValue(
      mockVehicles,
    );

    const result: GetVehiclesResponseDto[] = await service.getVehicles();

    expect(result).toEqual([
      { id: 1, make: 'Toyota', model: 'Corolla', year: 2020 },
      { id: 2, make: 'Honda', model: 'Civic', year: 2021 },
    ]);

    expect(prismaService.vehicle.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no vehicles are found', async () => {
    (prismaService.vehicle.findMany as jest.Mock).mockResolvedValue([]);

    const result: GetVehiclesResponseDto[] = await service.getVehicles();

    expect(result).toEqual([]);
    expect(prismaService.vehicle.findMany).toHaveBeenCalledTimes(1);
  });
});
