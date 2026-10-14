/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EmployeeSalaryService } from './employee-salary.service';
import { CreateEmployeeSalaryDto } from './dto/create-employee-salary.dto';
import { QueryEmployeeSalaryDto } from './dto/query-employee-salary.dto';
import { UpdateEmployeeSalaryDto } from './dto/update-employee-salary.dto';

@ApiTags('Employee Salary')
@ApiBearerAuth()
@Controller('employee-salary')
export class EmployeeSalaryController {
  constructor(
    private readonly employeeSalaryService: EmployeeSalaryService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new employee salary',
  })
  create(
    @Body()
    createEmployeeSalaryDto: CreateEmployeeSalaryDto,
  ) {
    return this.employeeSalaryService.create(
      createEmployeeSalaryDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all employee salaries (paginated)',
  })
  findAll(
    @Query()
    query: QueryEmployeeSalaryDto,
  ) {
    return this.employeeSalaryService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get employee salary by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.employeeSalaryService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update employee salary',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateEmployeeSalaryDto: UpdateEmployeeSalaryDto,
  ) {
    return this.employeeSalaryService.update(
      uuid,
      updateEmployeeSalaryDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete employee salary',
  })
  remove(@Param('uuid') uuid: string) {
    return this.employeeSalaryService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted employee salary',
  })
  restore(@Param('uuid') uuid: string) {
    return this.employeeSalaryService.restore(uuid);
  }
}
