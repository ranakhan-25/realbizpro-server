/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmployeeSalaryService } from './employee-salary.service';
import { CreateEmployeeSalaryDto } from './dto/create-employee-salary.dto';
import { QueryEmployeeSalaryDto } from './dto/query-employee-salary.dto';
import { UpdateEmployeeSalaryDto } from './dto/update-employee-salary.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Employee Salary')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employee-salary')
export class EmployeeSalaryController {
  constructor(private readonly employeeSalaryService: EmployeeSalaryService) {}

  @Post()
  @Permissions('create_employee_salary')
  @ApiOperation({ summary: 'Create employee salary' })
  create(
    @Body() dto: CreateEmployeeSalaryDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeSalaryService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_employee_salary')
  @ApiOperation({ summary: 'Get all employee salarys (paginated)' })
  findAll(
    @Query() query: QueryEmployeeSalaryDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeSalaryService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_employee_salary')
  @ApiOperation({ summary: 'Get employee salary by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeSalaryService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_employee_salary')
  @ApiOperation({ summary: 'Update employee salary' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateEmployeeSalaryDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeSalaryService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_employee_salary')
  @ApiOperation({ summary: 'Delete employee salary' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeSalaryService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_employee_salary')
  @ApiOperation({ summary: 'Restore soft-deleted employee salary' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeSalaryService.restore(uuid, userId, currentUser);
  }
}
