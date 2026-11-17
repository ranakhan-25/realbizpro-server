/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmployeeTypeService } from './employee-type.service';
import { CreateEmployeeTypeDto } from './dto/create-employee-type.dto';
import { QueryEmployeeTypeDto } from './dto/query-employee-type.dto';
import { UpdateEmployeeTypeDto } from './dto/update-employee-type.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Employee Type')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employee-type')
export class EmployeeTypeController {
  constructor(private readonly employeeTypeService: EmployeeTypeService) {}

  @Post()
  @Permissions('create_employee_type')
  @ApiOperation({ summary: 'Create employee type' })
  create(
    @Body() dto: CreateEmployeeTypeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeTypeService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_employee_type')
  @ApiOperation({ summary: 'Get all employee types (paginated)' })
  findAll(
    @Query() query: QueryEmployeeTypeDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeTypeService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_employee_type')
  @ApiOperation({ summary: 'Get employee type by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeTypeService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_employee_type')
  @ApiOperation({ summary: 'Update employee type' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateEmployeeTypeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeTypeService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_employee_type')
  @ApiOperation({ summary: 'Delete employee type' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeTypeService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_employee_type')
  @ApiOperation({ summary: 'Restore soft-deleted employee type' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeTypeService.restore(uuid, userId, currentUser);
  }
}
