/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { QueryDepartmentDto } from './dto/query-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Department')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Permissions('create_department')
  @ApiOperation({ summary: 'Create department' })
  create(
    @Body() dto: CreateDepartmentDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.departmentService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_department')
  @ApiOperation({ summary: 'Get all departments (paginated)' })
  findAll(
    @Query() query: QueryDepartmentDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.departmentService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_department')
  @ApiOperation({ summary: 'Get department by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.departmentService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_department')
  @ApiOperation({ summary: 'Update department' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateDepartmentDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.departmentService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_department')
  @ApiOperation({ summary: 'Delete department' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.departmentService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_department')
  @ApiOperation({ summary: 'Restore soft-deleted department' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.departmentService.restore(uuid, userId, currentUser);
  }
}
