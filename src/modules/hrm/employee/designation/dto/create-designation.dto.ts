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
import { DesignationStatus } from 'src/database/models/hrm/employee/hrm_designation_model';

export class CreateDesignationDto {
  @ApiProperty({
    description: 'Designation name',
    example: 'Junior Executive',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Designation name is required',
  })
  name: string;

  @ApiProperty({
    description: 'Department uuid',
    example: 'department-uuid',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Department is required',
  })
  departmentId: string;

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
    description: 'Designation status',
    enum: DesignationStatus,
    default: DesignationStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(DesignationStatus)
  status?: DesignationStatus;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
