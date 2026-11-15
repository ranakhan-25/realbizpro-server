import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  EmployeeListStatus,
  MaritalStatus,
} from 'src/database/models/hrm/employee/hrm_employeeList_model';

export class QueryEmployeeListDto {
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
    example: 'Rahim',
    description:
      'Search by name, employee code, email, phone or NID',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'department-uuid',
    description: 'Filter by department',
  })
  @IsOptional()
  @IsUUID('all')
  departmentId?: string;

  @ApiPropertyOptional({
    example: 'designation-uuid',
    description: 'Filter by designation',
  })
  @IsOptional()
  @IsUUID('all')
  designationId?: string;

  @ApiPropertyOptional({
    example: 'unit-uuid',
    description: 'Filter by unit',
  })
  @IsOptional()
  @IsUUID('all')
  unitId?: string;

  @ApiPropertyOptional({
    example: 'section-uuid',
    description: 'Filter by section',
  })
  @IsOptional()
  @IsUUID('all')
  sectionId?: string;

  @ApiPropertyOptional({
    example: 'salary-grade-uuid',
    description: 'Filter by salary grade',
  })
  @IsOptional()
  @IsUUID('all')
  salaryGradeId?: string;

  @ApiPropertyOptional({
    example: 'shift-uuid',
    description: 'Filter by shift',
  })
  @IsOptional()
  @IsUUID('all')
  shiftId?: string;

  @ApiPropertyOptional({
    example: 'employee-type-uuid',
    description: 'Filter by employee type',
  })
  @IsOptional()
  @IsUUID('all')
  employeeTypeId?: string;

  @ApiPropertyOptional({
    example: 'under-uuid',
    description: 'Filter by under',
  })
  @IsOptional()
  @IsUUID('all')
  underId?: string;

  @ApiPropertyOptional({
    enum: EmployeeListStatus,
    example: EmployeeListStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EmployeeListStatus)
  status?: EmployeeListStatus;

  @ApiPropertyOptional({
    enum: MaritalStatus,
    description: 'Filter by marital status',
  })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Joining date from (inclusive)',
  })
  @IsOptional()
  @IsDateString()
  joiningDateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Joining date to (inclusive)',
  })
  @IsOptional()
  @IsDateString()
  joiningDateTo?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
    enum: [
      'createdAt',
      'updatedAt',
      'name',
      'employeeCode',
      'joiningDate',
      'grossSalary',
      'status',
    ],
  })
  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'name',
    'employeeCode',
    'joiningDate',
    'grossSalary',
    'status',
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
    description:
      'Include unit, section, department, designation, salary grade, shift, employee type and under details',
    default: false,
  })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true,
  )
  @IsBoolean()
  withRelations?: boolean = false;

  @ApiPropertyOptional({
    description: 'Include soft-deleted employees',
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
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}

export class FindOneEmployeeListQueryDto {
  @ApiPropertyOptional({
    description:
      'Include unit, section, department, designation, salary grade, shift, employee type and under details',
    default: false,
  })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true,
  )
  @IsBoolean()
  withRelations?: boolean = false;
}
