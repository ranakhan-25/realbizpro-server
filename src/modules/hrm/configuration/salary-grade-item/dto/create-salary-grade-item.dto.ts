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
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { SalaryGradeItemType } from 'src/database/models/hrm/configuration/hrm_salary_grade_item_model';

export class CreateSalaryGradeItemDto {
  // ---------- SETUP ID ----------
  @ApiPropertyOptional({
    description: 'Allowance/Deduction setup UUID',
    example:
      'a8098c1a-f86e-11da-bd1a-00112444be1e',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsUUID()
  setupId?: string;

  // ---------- BASIC SALARY ----------
  @ApiPropertyOptional({
    description: 'Basic salary amount',
    example: 20000,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Basic salary must be a valid number',
    },
  )
  @Min(0, {
    message: 'Basic salary cannot be negative',
  })
  basicSalary?: number;

  // ---------- TYPE ----------
  @ApiProperty({
    description: 'Salary grade item type',
    enum: SalaryGradeItemType,
    example: SalaryGradeItemType.ALLOWANCE,
  })
  @IsEnum(SalaryGradeItemType, {
    message:
      'Type must be one of: ' +
      Object.values(SalaryGradeItemType).join(
        ', ',
      ),
  })
  type: SalaryGradeItemType;

  // ---------- NAME ----------
  @ApiProperty({
    description: 'Salary grade item name',
    example: 'House Rent',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  // ---------- PERCENT ----------
  @ApiPropertyOptional({
    description:
      'Percentage for this salary grade item',
    example: 20,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Percent must be a valid number' },
  )
  @Min(0, {
    message: 'Percent cannot be negative',
  })
  percent?: number;

  // ---------- AMOUNT ----------
  @ApiPropertyOptional({
    description:
      'Fixed amount for this salary grade item',
    example: 5000,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a valid number' },
  )
  @Min(0, {
    message: 'Amount cannot be negative',
  })
  amount?: number;

  // ---------- CREATED BY ----------
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
