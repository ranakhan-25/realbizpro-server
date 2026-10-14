import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class VerifyFaceAttendanceDto {
  @ApiProperty({
    example: 'EBR-107',
    description: 'Employee code',
  })
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @ApiProperty({
    example: '23.810331',
    description:
      'Optional latitude from the mobile device.',
    required: false,
  })
  @IsOptional()
  @IsString()
  latitude?: string;

  @ApiProperty({
    example: '90.412521',
    description:
      'Optional longitude from the mobile device.',
    required: false,
  })
  @IsOptional()
  @IsString()
  longitude?: string;

  @ApiProperty({
    example: 'Easy Soft Head Office',
    description:
      'Optional human-readable location name from Google location.',
    required: false,
  })
  @IsOptional()
  @IsString()
  locationName?: string;
}
