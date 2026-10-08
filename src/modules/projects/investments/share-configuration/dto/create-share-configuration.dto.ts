/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ShareConfigurationStatus } from 'src/database/models/projects/investor/configuration_model';

export class CreateShareConfigurationDto {
  @ApiProperty({
    description: 'Project UUID',
    example:
      '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Project ID is required',
  })
  projectId: string;

  @ApiProperty({
    description: 'Investor UUID',
    example:
      '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Investor ID is required',
  })
  investorId: string;

  @ApiProperty({
    description: 'Investment amount',
    example: 500000.0,
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Investment amount must be a valid number',
    },
  )
  @Min(0)
  investmentAmount: number;

  @ApiPropertyOptional({
    description: 'Profit percentage',
    example: 20.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Profit percent must be a valid number',
    },
  )
  @Min(0)
  @Max(100)
  profitPercent?: number;

  @ApiPropertyOptional({
    description: 'Fixed profit amount',
    example: 100000.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Fixed profit amount must be a valid number',
    },
  )
  @Min(0)
  fixedProfitAmount?: number;

  @ApiPropertyOptional({
    description:
      'Whether profit will be distributed',
    example: true,
    default: false,
  })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true,
  )
  @IsBoolean()
  isProfitDistribute?: boolean;

  @ApiPropertyOptional({
    description: 'Added by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  addedById?: string;

  @ApiPropertyOptional({
    description: 'Status',
    enum: ShareConfigurationStatus,
    default: ShareConfigurationStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ShareConfigurationStatus)
  status?: ShareConfigurationStatus;
}
