/* eslint-disable prettier/prettier */

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmployeeHierarchyService } from './employee-hierarchy.service';
import { QueryEmployeeHierarchyDto } from './dto/query-employee-hierarchy.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Employee Hierarchy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employee-hierarchy')
export class EmployeeHierarchyController {
  constructor(private readonly employeeHierarchyService: EmployeeHierarchyService) {}

  @Get()
  @Permissions('list_employee_hierarchy')
  @ApiOperation({ summary: 'Get employee hierarchy (designation wise, for org chart)' })
  findAll(
    @Query() query: QueryEmployeeHierarchyDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeHierarchyService.findAll(query, currentUser);
  }
}
