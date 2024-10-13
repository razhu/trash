import { Controller, Get } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { GetVehiclesResponseDto } from './dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Vehicle')
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiBearerAuth()
  @Get('all-vehicles')
  @ApiResponse({
    type: GetVehiclesResponseDto,
  })
  async getVehicles(): Promise<GetVehiclesResponseDto[]> {
    return this.vehicleService.getVehicles();
  }
}
