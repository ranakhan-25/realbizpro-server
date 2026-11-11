import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EmployeeListStatus } from 'src/database/models/hrm/employee/hrm_employeeList_model';

export class QueryEmployeeHierarchyDto {
  @ApiPropertyOptional({
    example: 'Nayon',
    description:
      'Search by employee name or employee code',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: EmployeeListStatus,
    example: EmployeeListStatus.ACTIVE,
    description: 'Filter by employee status',
  })
  @IsOptional()
  @IsEnum(EmployeeListStatus)
  status?: EmployeeListStatus;

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
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}
