import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateServiceAccountDto {
  // @ApiProperty({
  //   description: 'Name of the property',
  //   example: 'Pando Headquarters',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // property_name?: string;
  // @ApiProperty({
  //   description: 'Name of the company',
  //   example: 'Pando Inc.',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // company_name?: string;
  // @ApiProperty({
  //   enum: PropertyType,
  //   description: 'Type of property',
  //   required: false,
  // })
  // @IsOptional()
  // @IsEnum(PropertyType)
  // property_type?: PropertyType;
  // @ApiProperty({ description: 'Address information', required: false })
  // @IsOptional()
  // @ValidateNested()
  // @Type(() => AddressDto)
  // address?: AddressDto;
}
