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
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLabourWorkBankDto {
  @ApiProperty({
    description: 'Unique labour work bank code',
    example: 'LWB-2026-001',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Labour work bank code is required',
  })
  @MaxLength(100)
  code: string;

  @ApiProperty({
    description: 'Labour work bank name',
    example: 'Karim Labour Bank',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Labour work bank name is required',
  })
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Labour work bank business name',
    example: 'Karim Labour Bank Ltd.',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Labour work bank email address',
    example: 'labour@example.com',
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  email?: string;

  @ApiProperty({
    description: 'Labour work bank phone number',
    example: '01712345678',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Phone number is required',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Labour work bank address',
    example: 'Dhaka, Bangladesh',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  address?: string;

  @ApiPropertyOptional({
    description: 'Labour work bank credit limit',
    example: 500000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(999999999999)
  creditLimit?: number;

  @ApiPropertyOptional({
    description:
      'Labour work bank due date in ISO 8601 format',
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
    description: 'Labour work bank under group',
    example: 'Labour',
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
}
