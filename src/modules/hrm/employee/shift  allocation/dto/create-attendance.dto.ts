/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { AttendanceType } from 'src/database/models/hrm/employee/hrm_attendance_model';

export class CreateAttendanceDto {
  @ApiProperty({
    description: 'Employee UUID',
    example:
      '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('all', {
    message: 'Employee id must be a valid UUID',
  })
  @IsNotEmpty({
    message: 'Employee id is required',
  })
  employeeId: string;

  @ApiPropertyOptional({
    description: 'Month-Year UUID',
    example:
      '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsUUID('all', {
    message: 'Month year id must be a valid UUID',
  })
  monthYearId?: string;

  @ApiProperty({
    description: 'Attendance date (YYYY-MM-DD)',
    example: '2026-10-13',
  })
  @IsString()
  @IsNotEmpty({ message: 'Date is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @ApiProperty({
    description: 'Day name',
    example: 'Tuesday',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Day is required' })
  day: string;

  @ApiPropertyOptional({
    description: 'In time (HH:mm or HH:mm:ss)',
    example: '09:00:00',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    {
      message:
        'inTime must be in HH:mm or HH:mm:ss format',
    },
  )
  inTime?: string;

  @ApiPropertyOptional({
    description: 'Out time (HH:mm or HH:mm:ss)',
    example: '18:00:00',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    {
      message:
        'outTime must be in HH:mm or HH:mm:ss format',
    },
  )
  outTime?: string;

  @ApiPropertyOptional({
    description: 'Note',
    example: 'Worked from home',
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
  note?: string;

  @ApiPropertyOptional({
    description: 'Attendance type',
    enum: AttendanceType,
    default: AttendanceType.WORKDAY,
  })
  @IsOptional()
  @IsEnum(AttendanceType)
  type?: AttendanceType;
}
