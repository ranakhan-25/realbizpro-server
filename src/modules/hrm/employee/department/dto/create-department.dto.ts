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
import { DepartmentStatus } from 'src/database/models/hrm/employee/hrm_department_model';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Department name',
    example: 'Business Development',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Department name is required',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Department head (employee id)',
    example: 'employee-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  departmentHeadId?: string;

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
    description: 'Department status',
    enum: DepartmentStatus,
    default: DepartmentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(DepartmentStatus)
  status?: DepartmentStatus;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
