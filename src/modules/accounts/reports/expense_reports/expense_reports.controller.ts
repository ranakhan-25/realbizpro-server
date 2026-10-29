/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ExpenseReportService } from './expense_reports.service';
import { CreateExpenseReportDto } from './dto/create-expense_report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense_report.dto';
import { QueryExpenseReportDto } from './dto/query-expense_report.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Accounts | reports| expense-reports")
@Controller('expense-reports')
export class ExpenseReportController {
  constructor(private readonly expenseService: ExpenseReportService) {}

  @Post()
  create(@Body() dto: CreateExpenseReportDto) {
    return this.expenseService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryExpenseReportDto) {
    return this.expenseService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.expenseService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateExpenseReportDto) {
    return this.expenseService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateExpenseReportDto) {
    return this.expenseService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.expenseService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.expenseService.restore(uuid);
  }
}