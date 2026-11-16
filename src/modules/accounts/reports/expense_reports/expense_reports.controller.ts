/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ExpenseReportService } from './expense_reports.service';
import { CreateExpenseReportDto } from './dto/create-expense_report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense_report.dto';
import { QueryExpenseReportDto } from './dto/query-expense_report.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags("Accounts | reports | expense_reports")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('expense-reports')
export class ExpenseReportController {
  constructor(private readonly expenseReportService: ExpenseReportService) {}

  @Post()
  @Permissions('create_expense_report')
  @ApiOperation({ summary: 'Create expense report entry' })
  create(
    @Body() dto: CreateExpenseReportDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseReportService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_expense_report')
  @ApiOperation({ summary: 'List expense report entries' })
  findAll(
    @Query() query: QueryExpenseReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseReportService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_expense_report')
  @ApiOperation({ summary: 'Get expense report entry by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseReportService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_expense_report')
  @ApiOperation({ summary: 'Update expense report entry (PATCH)' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateExpenseReportDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseReportService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_expense_report')
  @ApiOperation({ summary: 'Update expense report entry (PUT)' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateExpenseReportDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseReportService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_expense_report')
  @ApiOperation({ summary: 'Delete expense report entry' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseReportService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_expense_report')
  @ApiOperation({ summary: 'Restore expense report entry' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseReportService.restore(uuid, userId, currentUser);
  }
}
