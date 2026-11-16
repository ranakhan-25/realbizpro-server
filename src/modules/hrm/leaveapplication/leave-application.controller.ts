/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LeaveApplicationService } from './leave-application.service';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { FindOneLeaveApplicationQueryDto, QueryLeaveApplicationDto } from './dto/query-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Leave | Leave Application')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('leave-application')
export class LeaveApplicationController {
  constructor(private readonly leaveApplicationService: LeaveApplicationService) {}

  @Post()
  @Permissions('create_leave_application')
  @ApiOperation({ summary: 'Create leave application' })
  create(
    @Body() createLeaveApplicationDto: CreateLeaveApplicationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveApplicationService.create(createLeaveApplicationDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_leave_application')
  @ApiOperation({ summary: 'Get all leave applications (paginated)' })
  findAll(
    @Query() query: QueryLeaveApplicationDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveApplicationService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_leave_application')
  @ApiOperation({ summary: 'Get leave application by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @Query() query: FindOneLeaveApplicationQueryDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveApplicationService.findOne(uuid, query?.withRelations, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_leave_application')
  @ApiOperation({ summary: 'Update leave application' })
  update(
    @Param('uuid') uuid: string,
    @Body() updateLeaveApplicationDto: UpdateLeaveApplicationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveApplicationService.update(uuid, updateLeaveApplicationDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_leave_application')
  @ApiOperation({ summary: 'Soft delete leave application (status → cancelled)' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveApplicationService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_leave_application')
  @ApiOperation({ summary: 'Restore soft-deleted leave application' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.leaveApplicationService.restore(uuid, userId, currentUser);
  }
}
