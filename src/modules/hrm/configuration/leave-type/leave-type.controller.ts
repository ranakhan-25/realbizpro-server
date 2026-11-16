/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { QueryLeaveTypeDto } from './dto/query-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Configuation | Leave Type')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('leave-type')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Post()
  @Permissions('create_leave_type')
  @ApiOperation({ summary: 'Create leave type' })
  create(
    @Body() dto: CreateLeaveTypeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveTypeService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_leave_type')
  @ApiOperation({ summary: 'Get all leave types (paginated)' })
  findAll(
    @Query() query: QueryLeaveTypeDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveTypeService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_leave_type')
  @ApiOperation({ summary: 'Get leave type by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveTypeService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_leave_type')
  @ApiOperation({ summary: 'Update leave type' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateLeaveTypeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveTypeService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_leave_type')
  @ApiOperation({ summary: 'Delete leave type' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveTypeService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_leave_type')
  @ApiOperation({ summary: 'Restore soft-deleted leave type' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveTypeService.restore(uuid, userId, currentUser);
  }
}
