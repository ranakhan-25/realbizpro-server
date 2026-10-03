/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCustomerAccountDto {
  @ApiProperty({
    description: 'Unique customer account code',
    example: 'CUS-2026-001',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Customer account code is required',
  })
  @MaxLength(100)
  customerCode: string;

  @ApiProperty({
    description: 'Customer account name',
    example: 'Hasibul Islam',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Customer account name is required',
  })
  @MaxLength(255)
  customerName: string;

  @ApiProperty({
    description: 'Customer account mobile number',
    example: '01712345678',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Mobile number is required',
  })
  mobileNo: string;

  @ApiPropertyOptional({
    description: 'Customer account email',
    example: 'customer@example.com',
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  email?: string;

  @ApiPropertyOptional({
    description: 'Business name',
    example: 'ABC Business',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  businessName?: string;

  @ApiPropertyOptional({
    description: 'NID or Passport number',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  nidOrPassport?: string;

  @ApiPropertyOptional({
    description: 'Customer account under group',
    example: 'Corporate',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  underGroup?: string;

  @ApiPropertyOptional({
    description: 'Customer account address',
    example: 'Dhaka, Bangladesh',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  address?: string;

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
}
