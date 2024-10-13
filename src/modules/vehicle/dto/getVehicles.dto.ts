import { ApiProperty } from '@nestjs/swagger';

export class GetVehiclesResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the vehicle',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The manufacturer of the vehicle',
    example: 'Tesla',
  })
  make: string;

  @ApiProperty({
    description: 'The model of the vehicle',
    example: 'Model S',
  })
  model: string;

  @ApiProperty({
    description: 'The year the vehicle was manufactured',
    example: '2024',
  })
  year: string;
}
