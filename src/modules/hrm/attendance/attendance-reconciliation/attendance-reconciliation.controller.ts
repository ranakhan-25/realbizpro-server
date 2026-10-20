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

import { AttendanceReconciliationService } from './attendance-reconciliation.service';
import { CreateAttendanceReconciliationDto } from './dto/create-attendance-reconciliation.dto';
import { QueryAttendanceReconciliationDto } from './dto/query-attendance-reconciliation.dto';
import { UpdateAttendanceReconciliationDto } from './dto/update-attendance-reconciliation.dto';

@ApiTags('HRM | Employee | Attendance Reconciliation')
@ApiBearerAuth()
@Controller('attendance-reconciliation')
export class AttendanceReconciliationController {
  constructor(
    private readonly attendanceReconciliationService: AttendanceReconciliationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new attendance reconciliation',
  })
  create(
    @Body()
    createAttendanceReconciliationDto: CreateAttendanceReconciliationDto,
  ) {
    return this.attendanceReconciliationService.create(
      createAttendanceReconciliationDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all attendance reconciliations (paginated)',
  })
  findAll(
    @Query()
    query: QueryAttendanceReconciliationDto,
  ) {
    return this.attendanceReconciliationService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get attendance reconciliation by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.attendanceReconciliationService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update attendance reconciliation',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateAttendanceReconciliationDto: UpdateAttendanceReconciliationDto,
  ) {
    return this.attendanceReconciliationService.update(
      uuid,
      updateAttendanceReconciliationDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete attendance reconciliation',
  })
  remove(@Param('uuid') uuid: string) {
    return this.attendanceReconciliationService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted attendance reconciliation',
  })
  restore(@Param('uuid') uuid: string) {
    return this.attendanceReconciliationService.restore(uuid);
  }
}
