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
} from 'class-validator';
import { EmployeeTypeStatus } from 'src/database/models/hrm/employee/hrm_employee_type-model';

export class CreateEmployeeTypeDto {
  @ApiProperty({
    description: 'Employee type name',
    example: 'Permanent',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Employee type name is required',
  })
  name: string;

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
    description: 'Employee type status',
    enum: EmployeeTypeStatus,
    default: EmployeeTypeStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EmployeeTypeStatus)
  status?: EmployeeTypeStatus;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
