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
  Max,
  Min,
} from 'class-validator';

export class CreateCommissionDto {
  @ApiProperty({
    description: 'Employee UUID',
    example: 'employee-uuid',
  })
  @IsUUID('all', {
    message: 'Employee id must be a valid UUID',
  })
  @IsNotEmpty({ message: 'Employee id is required' })
  employeeId: string;

  @ApiPropertyOptional({
    description: 'Commission type',
    example: 'Sales',
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
  type?: string;

  @ApiPropertyOptional({
    description: 'Commission calculation type',
    example: 'percentage',
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
  commissionType?: string;

  @ApiProperty({
    description: 'Commission title',
    example: 'Monthly Sales Commission',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Commission title is required',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Commission value',
    example: '5',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'number'
      ? String(value)
      : value === ''
        ? null
        : value,
  )
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    description: 'Commission amount (max 2 decimal places)',
    example: 2000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Commission amount must be a number with max 2 decimal places',
    },
  )
  @Min(0)
  @Max(9999999999.99)
  amount?: number;

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
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}
