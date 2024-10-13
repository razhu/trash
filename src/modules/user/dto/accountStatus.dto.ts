import { ApiProperty } from '@nestjs/swagger';

export class AccountStatusResponseDto {
  @ApiProperty({
    description: 'Indicates whether the phone number has been verified',
    example: true,
  })
  isPhoneVerified: boolean;

  @ApiProperty({
    description: 'Indicates whether a vehicle has been selected',
    example: true,
  })
  isVehicleSelected: boolean;

  @ApiProperty({
    description: 'Indicates whether payment information has been added',
    example: true,
  })
  isPaymentAdded: boolean;

  @ApiProperty({
    description: `Indicates whether the user's account setup is complete`,
    example: false,
  })
  isSetupComplete: boolean;

  @ApiProperty({
    description: `Indicates whether the user's account is active`,
    example: false,
  })
  isActive: boolean;
}
