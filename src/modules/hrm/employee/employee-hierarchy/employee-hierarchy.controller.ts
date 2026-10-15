import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EmployeeHierarchyService } from './employee-hierarchy.service';
import { QueryEmployeeHierarchyDto } from './dto/query-employee-hierarchy.dto';

@ApiTags('HRM | Employee | Employee Hierarchy')
@ApiBearerAuth()
@Controller('employee-hierarchy')
export class EmployeeHierarchyController {
  constructor(
    private readonly employeeHierarchyService: EmployeeHierarchyService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Get employee hierarchy (designation wise, for org chart)',
  })
  findAll(
    @Query()
    query: QueryEmployeeHierarchyDto,
  ) {
    return this.employeeHierarchyService.findAll(
      query,
    );
  }
}
