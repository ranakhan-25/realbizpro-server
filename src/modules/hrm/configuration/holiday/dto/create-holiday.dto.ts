/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { HolidayStatus } from 'src/database/models/hrm/configuration/holiday_model';

export class CreateHolidayDto {
  @ApiProperty({
    description: 'Holiday reason',
    example: 'Eid-ul-Fitr',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Reason is required' })
  reason: string;

  @ApiProperty({
    description: 'From date (YYYY-MM-DD)',
    example: '2026-03-20',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'From date must be in YYYY-MM-DD format',
  })
  @IsDateString(
    {},
    { message: 'From date must be a valid date' },
  )
  fromDate: string;

  @ApiProperty({
    description: 'To date (YYYY-MM-DD)',
    example: '2026-03-22',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'To date must be in YYYY-MM-DD format',
  })
  @IsDateString(
    {},
    { message: 'To date must be a valid date' },
  )
  toDate: string;

  @ApiProperty({
    description: 'Description',
    example: 'Eid holidays',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Description is required',
  })
  description: string;

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
    description: 'Holiday status',
    enum: HolidayStatus,
    default: HolidayStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(HolidayStatus)
  status?: HolidayStatus;
}
