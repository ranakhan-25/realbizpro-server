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

import { LeaveApplicationService } from './leave-application.service';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import {
  FindOneLeaveApplicationQueryDto,
  QueryLeaveApplicationDto,
} from './dto/query-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';

@ApiTags('HRM | Leave | Leave Application')
@ApiBearerAuth()
@Controller('leave-application')
export class LeaveApplicationController {
  constructor(
    private readonly leaveApplicationService: LeaveApplicationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new leave application',
  })
  create(
    @Body()
    createLeaveApplicationDto: CreateLeaveApplicationDto,
  ) {
    return this.leaveApplicationService.create(
      createLeaveApplicationDto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all leave applications (paginated)',
  })
  findAll(
    @Query()
    query: QueryLeaveApplicationDto,
  ) {
    return this.leaveApplicationService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get leave application by UUID',
  })
  findOne(
    @Param('uuid') uuid: string,
    @Query()
    query: FindOneLeaveApplicationQueryDto,
  ) {
    return this.leaveApplicationService.findOne(
      uuid,
      query.withRelations,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update leave application',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateLeaveApplicationDto: UpdateLeaveApplicationDto,
  ) {
    return this.leaveApplicationService.update(
      uuid,
      updateLeaveApplicationDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete leave application (status → cancelled)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.leaveApplicationService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted leave application (status → pending)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.leaveApplicationService.restore(
      uuid,
    );
  }
}
