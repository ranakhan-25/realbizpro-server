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
import { SupplierAccountsStatus } from 'src/database/models/projects/contract/pr_supplier_accounts_model';

export class CreateSupplierAccountDto {
  @ApiProperty({
    description: 'Unique supplier account code',
    example: 'SUP-2026-001',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Supplier account code is required',
  })
  supplierCode: string;

  @ApiProperty({
    description: 'Supplier account name',
    example: 'Rahim Traders',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Supplier account name is required',
  })
  supplierName: string;

  @ApiPropertyOptional({
    description: 'Supplier business name',
    example: 'Rahim Traders Ltd.',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Supplier email address',
    example: 'supplier@example.com',
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  email?: string;

  @ApiProperty({
    description: 'Supplier phone number',
    example: '01712345678',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Phone number is required',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Supplier address',
    example: 'Dhaka, Bangladesh',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  address?: string;

  @ApiPropertyOptional({
    description: 'Supplier credit limit',
    example: 500000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @ApiPropertyOptional({
    description:
      'Supplier due date in ISO 8601 format',
    example: '2026-12-31T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'Due date must be a valid ISO 8601 date string',
    },
  )
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Supplier account under group',
    example: 'Local Supplier',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  underGroup?: string;

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
    description: 'Supplier account status',
    enum: SupplierAccountsStatus,
    default: SupplierAccountsStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(SupplierAccountsStatus)
  status?: SupplierAccountsStatus;
}
