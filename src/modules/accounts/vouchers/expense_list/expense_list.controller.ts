/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ExpenseService } from './expense_list.service';
import { CreateExpenseDto } from './dto/create-expense_list.dto';
import { QueryExpenseDto } from './dto/query-expense_list.dto';
import { UpdateExpenseDto } from './dto/update-expense_list.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Accounts|vouchers|expense")
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() dto: CreateExpenseDto) {
    return this.expenseService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryExpenseDto) {
    return this.expenseService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.expenseService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateExpenseDto) {
    return this.expenseService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateExpenseDto) {
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