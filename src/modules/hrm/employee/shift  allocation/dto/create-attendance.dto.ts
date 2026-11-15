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
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
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

  @ApiPropertyOptional({
    description: 'Department UUID',
    example:
      '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsUUID('all', {
    message: 'departmentId must be a valid UUID',
  })
  departmentId?: string;

  @ApiPropertyOptional({
    description: 'Shift UUID',
    example:
      '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsUUID('all', {
    message: 'shiftId must be a valid UUID',
  })
  shiftId?: string;

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
    description: 'Worked hours',
    example: 8,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Hours must be a number (max 2 decimals)',
    },
  )
  @Min(0)
  @Max(24)
  hours?: number;

  @ApiPropertyOptional({
    description: 'In selfie (url/path)',
    example: 'uploads/in.jpg',
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
  inSelfie?: string;

  @ApiPropertyOptional({
    description: 'Out selfie (url/path)',
    example: 'uploads/out.jpg',
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
  outSelfie?: string;

  @ApiPropertyOptional({
    description: 'In location',
    example: '23.7510,90.3790',
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
  inLocation?: string;

  @ApiPropertyOptional({
    description: 'Out location',
    example: '23.7510,90.3790',
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
  outLocation?: string;

  @ApiPropertyOptional({
    description: 'Location',
    example: 'Dhaka',
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
  location?: string;

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
    description: 'Comment',
    example: 'Approved by manager',
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
  comment?: string;

  @ApiPropertyOptional({
    description: 'Is present',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true'
      ? true
      : value === 'false'
        ? false
        : value,
  )
  @IsBoolean()
  isPresent?: boolean;

  @ApiPropertyOptional({
    description: 'Attendance type',
    enum: AttendanceType,
    default: AttendanceType.WORKDAY,
  })
  @IsOptional()
  @IsEnum(AttendanceType)
  type?: AttendanceType;

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
