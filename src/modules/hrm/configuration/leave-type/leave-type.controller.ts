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

import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { QueryLeaveTypeDto } from './dto/query-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';

@ApiTags('HRM | Configuation | Leave Type')
@ApiBearerAuth()
@Controller('leave-type')
export class LeaveTypeController {
  constructor(
    private readonly leaveTypeService: LeaveTypeService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new leave type',
  })
  create(
    @Body()
    createLeaveTypeDto: CreateLeaveTypeDto,
  ) {
    return this.leaveTypeService.create(
      createLeaveTypeDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all leave types (paginated)',
  })
  findAll(
    @Query()
    query: QueryLeaveTypeDto,
  ) {
    return this.leaveTypeService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get leave type by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.leaveTypeService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update leave type',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateLeaveTypeDto: UpdateLeaveTypeDto,
  ) {
    return this.leaveTypeService.update(
      uuid,
      updateLeaveTypeDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete leave type (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.leaveTypeService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted leave type (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.leaveTypeService.restore(uuid);
  }
}
