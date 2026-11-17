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
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateBoqDto {
  @ApiPropertyOptional({
    description: 'Project UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsUUID('all', {
    message: 'Project id must be a valid UUID',
  })
  projectId?: string;

  @ApiPropertyOptional({
    description: 'BOQ UID',
    example: 'BOQ-0001',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  uid?: string;

  @ApiProperty({
    description: 'Date (YYYY-MM-DD)',
    example: '2026-10-23',
  })
  @IsString()
  @IsNotEmpty({ message: 'Date is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @ApiProperty({
    description: 'Title of work',
    example: 'Foundation Work',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Title of work is required' })
  titleOfWork: string;

  @ApiProperty({
    description: 'Task',
    example: 'Excavation',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Task is required' })
  task: string;

  @ApiPropertyOptional({
    description: 'Budget',
    example: 500000,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Budget must be a number (max 2 decimals)' },
  )
  @Min(0)
  @Max(9999999999.99)
  budget?: number;

  @ApiPropertyOptional({
    description: 'Percentage of total budget',
    example: 10,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Percentage of total budget must be a number (max 2 decimals)' },
  )
  @Min(0)
  @Max(100)
  percentageOfTotalBudget?: number;

  @ApiPropertyOptional({
    description: 'Per sft budget',
    example: 250,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Per sft budget must be a number (max 2 decimals)' },
  )
  @Min(0)
  @Max(9999999999.99)
  perSftBudget?: number;

  @ApiPropertyOptional({
    description: 'Cost',
    example: 120000,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Cost must be a number (max 2 decimals)' },
  )
  @Min(0)
  @Max(9999999999.99)
  cost?: number;

  @ApiPropertyOptional({
    description: 'Available',
    example: 380000,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Available must be a number (max 2 decimals)' },
  )
  @Min(0)
  @Max(9999999999.99)
  available?: number;

  @ApiPropertyOptional({
    description: 'Added by (name)',
    example: 'Niloy',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsString()
  addedBy?: string;

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
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
