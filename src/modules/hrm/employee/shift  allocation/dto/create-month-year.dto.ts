/* eslint-disable prettier/prettier */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min, IsOptional } from 'class-validator';

export class CreateMonthYearDto {
  @ApiProperty({
    description: 'Month name',
    example: 'January',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Month is required' })
  month: string;

  @ApiProperty({
    description: 'Year',
    example: 2026,
  })
  @Type(() => Number)
  @IsInt({ message: 'Year must be an integer' })
  @Min(1900)
  @Max(2200)
  year: number;

  @ApiProperty({
    description: 'Start date (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @IsDateString(
    {},
    {
      message:
        'Start date must be a valid date (YYYY-MM-DD)',
    },
  )
  startDate: string;

  @ApiProperty({
    description: 'End date (YYYY-MM-DD)',
    example: '2026-01-31',
  })
  @IsDateString(
    {},
    {
      message:
        'End date must be a valid date (YYYY-MM-DD)',
    },
  )
  endDate: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
