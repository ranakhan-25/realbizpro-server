/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CreatePayableReportDto } from './dto/create-payeble_report.dto';
import { PayableReportService } from './payeble_report.service';
import { QueryPayableReportDto } from './dto/query-payeble_report.dto';
import { UpdatePayableReportDto } from './dto/update-payeble_report.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Account | reports | payeble reports")
@Controller('payable-reports')
export class PayableReportController {
  constructor(private readonly payableService: PayableReportService) {}

  @Post()
  create(@Body() dto: CreatePayableReportDto) {
    return this.payableService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryPayableReportDto) {
    return this.payableService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.payableService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdatePayableReportDto) {
    return this.payableService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdatePayableReportDto) {
    return this.payableService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.payableService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.payableService.restore(uuid);
  }
}