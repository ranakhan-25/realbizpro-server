/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Permissions('create_attendance')
  @ApiOperation({ summary: 'Create attendance' })
  create(
    @Body() dto: CreateAttendanceDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_attendance')
  @ApiOperation({ summary: 'Get all attendances (paginated)' })
  findAll(
    @Query() query: QueryAttendanceDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_attendance')
  @ApiOperation({ summary: 'Get attendance by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_attendance')
  @ApiOperation({ summary: 'Update attendance' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateAttendanceDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_attendance')
  @ApiOperation({ summary: 'Delete attendance' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_attendance')
  @ApiOperation({ summary: 'Restore soft-deleted attendance' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.attendanceService.restore(uuid, userId, currentUser);
  }
}
