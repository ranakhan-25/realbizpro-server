/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { PayableReportService } from './payeble_report.service';
import { CreatePayableReportDto } from './dto/create-payeble_report.dto';
import { UpdatePayableReportDto } from './dto/update-payeble_report.dto';
import { QueryPayableReportDto } from './dto/query-payeble_report.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags("Accounts | reports | payable_report")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payable-reports')
export class PayableReportController {
  constructor(private readonly payableReportService: PayableReportService) {}

  @Post()
  @Permissions('create_payable_report')
  @ApiOperation({ summary: 'Create payable report entry' })
  create(
    @Body() dto: CreatePayableReportDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.payableReportService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_payable_report')
  @ApiOperation({ summary: 'List payable report entries' })
  findAll(
    @Query() query: QueryPayableReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.payableReportService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_payable_report')
  @ApiOperation({ summary: 'Get payable report entry by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.payableReportService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_payable_report')
  @ApiOperation({ summary: 'Update payable report entry (PATCH)' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdatePayableReportDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.payableReportService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_payable_report')
  @ApiOperation({ summary: 'Update payable report entry (PUT)' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdatePayableReportDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.payableReportService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_payable_report')
  @ApiOperation({ summary: 'Delete payable report entry' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.payableReportService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_payable_report')
  @ApiOperation({ summary: 'Restore payable report entry' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.payableReportService.restore(uuid, userId, currentUser);
  }
}
