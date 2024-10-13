import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { GetVehiclesResponseDto } from './dto';

describe('VehicleController', () => {
  let controller: VehicleController;
  let vehicleService: VehicleService;

  const mockVehicles: GetVehiclesResponseDto[] = [
    { id: 1, make: 'Toyota', model: 'Corolla', year: '2020' },
    { id: 2, make: 'Ford', model: 'Focus', year: '2018' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            getVehicles: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    vehicleService = module.get<VehicleService>(VehicleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return vehicles', async () => {
    (vehicleService.getVehicles as jest.Mock).mockResolvedValue(mockVehicles);

    const result = await controller.getVehicles();
    expect(vehicleService.getVehicles).toHaveBeenCalled();
    expect(result).toEqual(mockVehicles);
  });

  it('should return an empty array if no vehicles are found', async () => {
    (vehicleService.getVehicles as jest.Mock).mockResolvedValue([]);

    const result = await controller.getVehicles();
    expect(result).toEqual([]);
  });
});
