/* eslint-disable prettier/prettier */

import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { SalaryGradeItemType } from 'src/database/models/hrm/configuration/hrm_salary_grade_item_model';

export class QuerySalaryGradeItemDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Current page number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 0,
    description:
      'Number of records to skip (alternative to page)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    example: 'House Rent',
    description:
      'Search by salary grade item name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: SalaryGradeItemType,
    example: SalaryGradeItemType.ALLOWANCE,
    description: 'Filter by item type',
  })
  @IsOptional()
  @IsEnum(SalaryGradeItemType)
  type?: SalaryGradeItemType;

  @ApiPropertyOptional({
    example:
      'a8098c1a-f86e-11da-bd1a-00112444be1e',
    description:
      'Filter by allowance/deduction setup UUID',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? undefined : value,
  )
  @IsUUID()
  setupId?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
    enum: [
      'createdAt',
      'updatedAt',
      'name',
      'type',
      'setupId',
      'basicSalary',
      'percent',
      'amount',
    ],
  })
  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'name',
    'type',
    'setupId',
    'basicSalary',
    'percent',
    'amount',
  ])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'DESC',
    default: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Include soft-deleted records',
    default: false,
  })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true,
  )
  @IsBoolean()
  withDeleted?: boolean = false;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
