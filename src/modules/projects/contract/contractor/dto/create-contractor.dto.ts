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
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  ContractorStatus,
  ContractorUnderStatus,
} from 'src/database/models/projects/contract/pr_contractor.model';

export class CreateContractorDto {
  @ApiProperty({
    description: 'Unique contractor code',
    example: 'CON-2026-001',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Contractor code is required',
  })
  code: string;

  @ApiProperty({
    description: 'Contractor name',
    example: 'Hasibul Islam',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Contractor name is required',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Business name',
    example: 'ABC Construction',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Contractor email',
    example: 'contractor@example.com',
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  email?: string;

  @ApiProperty({
    description: 'Contractor mobile number',
    example: '01712345678',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Mobile number is required',
  })
  mobileNo: string;

  @ApiPropertyOptional({
    description: 'Contractor address',
    example: 'Dhaka, Bangladesh',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  address?: string;

  @ApiPropertyOptional({
    description: 'Credit limit',
    example: 50000.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Credit limit must be a number' },
  )
  @Min(0)
  @Transform(({ value }) =>
    value === '' || value === null
      ? null
      : Number(value),
  )
  creditLimit?: number;

  @ApiPropertyOptional({
    description: 'Due date (YYYY-MM-DD)',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Under status',
    enum: ContractorUnderStatus,
    default: ContractorUnderStatus.WORKER,
  })
  @IsOptional()
  @IsEnum(ContractorUnderStatus)
  under?: ContractorUnderStatus;

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
    description: 'Contractor status',
    enum: ContractorStatus,
    default: ContractorStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ContractorStatus)
  status?: ContractorStatus;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
