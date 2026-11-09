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
import { SectionStatus } from 'src/database/models/hrm/employee/hrm_section_model';

export class CreateSectionDto {
  @ApiProperty({
    description: 'Section name',
    example: 'Section-A',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Section name is required',
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
    description: 'Section status',
    enum: SectionStatus,
    default: SectionStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(SectionStatus)
  status?: SectionStatus;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
