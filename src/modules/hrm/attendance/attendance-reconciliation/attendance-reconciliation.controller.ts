/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttendanceReconciliationService } from './attendance-reconciliation.service';
import { CreateAttendanceReconciliationDto } from './dto/create-attendance-reconciliation.dto';
import { QueryAttendanceReconciliationDto } from './dto/query-attendance-reconciliation.dto';
import { UpdateAttendanceReconciliationDto } from './dto/update-attendance-reconciliation.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Attendance Reconciliation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('attendance-reconciliation')
export class AttendanceReconciliationController {
  constructor(private readonly attendanceReconciliationService: AttendanceReconciliationService) {}

  @Post()
  @Permissions('create_attendance_reconciliation')
  @ApiOperation({ summary: 'Create attendance reconciliation' })
  create(
    @Body() dto: CreateAttendanceReconciliationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceReconciliationService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_attendance_reconciliation')
  @ApiOperation({ summary: 'Get all attendance reconciliations (paginated)' })
  findAll(
    @Query() query: QueryAttendanceReconciliationDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceReconciliationService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_attendance_reconciliation')
  @ApiOperation({ summary: 'Get attendance reconciliation by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceReconciliationService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_attendance_reconciliation')
  @ApiOperation({ summary: 'Update attendance reconciliation' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateAttendanceReconciliationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceReconciliationService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_attendance_reconciliation')
  @ApiOperation({ summary: 'Delete attendance reconciliation' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceReconciliationService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_attendance_reconciliation')
  @ApiOperation({ summary: 'Restore soft-deleted attendance reconciliation' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceReconciliationService.restore(uuid, userId, currentUser);
  }
}
