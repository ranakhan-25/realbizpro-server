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
import { UnitStatus } from 'src/database/models/hrm/employee/hrm_unit_model';

export class CreateUnitDto {
  @ApiProperty({
    description: 'Unit name',
    example: 'Unit-1',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Unit name is required',
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
    description: 'Unit status',
    enum: UnitStatus,
    default: UnitStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
