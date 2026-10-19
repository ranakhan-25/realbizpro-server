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
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { LeaveTypeStatus } from 'src/database/models/hrm/configuration/leave_type_list';

export class CreateLeaveTypeDto {
  @ApiProperty({
    description: 'Leave type name',
    example: 'Casual Leave',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Leave type name is required',
  })
  name: string;

  @ApiProperty({
    description: 'Allocation days per year',
    example: 10,
  })
  @Type(() => Number)
  @IsInt({
    message: 'Allocation day must be an integer',
  })
  @Min(0)
  @Max(366)
  allocationDay: number;

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
    description: 'Leave type status',
    enum: LeaveTypeStatus,
    default: LeaveTypeStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(LeaveTypeStatus)
  status?: LeaveTypeStatus;
}
