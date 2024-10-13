import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class SaveUserVehicleRequestDto {
  @ApiProperty({
    description: 'The unique identifier of the vehicle',
    example: 1,
  })
  @IsInt()
  vehicleId: number;
}
