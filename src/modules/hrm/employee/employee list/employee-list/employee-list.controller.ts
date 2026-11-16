/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmployeeListService } from './employee-list.service';
import { CreateEmployeeListDto } from './dto/create-employee-list.dto';
import { FindOneEmployeeListQueryDto, QueryEmployeeListDto } from './dto/query-employee-list.dto';
import { UpdateEmployeeListDto } from './dto/update-employee-list.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee |Employee List')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employee-list')
export class EmployeeListController {
  constructor(private readonly employeeListService: EmployeeListService) {}

  @Post()
  @Permissions('create_employee_list')
  @ApiOperation({ summary: 'Create a new employee' })
  create(
    @Body() createEmployeeListDto: CreateEmployeeListDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeListService.create(createEmployeeListDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_employee_list')
  @ApiOperation({ summary: 'Get all employees (paginated)' })
  findAll(
    @Query() query: QueryEmployeeListDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeListService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_employee_list')
  @ApiOperation({ summary: 'Get employee by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @Query() query: FindOneEmployeeListQueryDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeListService.findOne(uuid, query?.withRelations, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_employee_list')
  @ApiOperation({ summary: 'Update employee' })
  update(
    @Param('uuid') uuid: string,
    @Body() updateEmployeeListDto: UpdateEmployeeListDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeListService.update(uuid, updateEmployeeListDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_employee_list')
  @ApiOperation({ summary: 'Soft delete employee (status → inactive)' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeListService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_employee_list')
  @ApiOperation({ summary: 'Restore soft-deleted employee (status → active)' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeListService.restore(uuid, userId, currentUser);
  }
}
