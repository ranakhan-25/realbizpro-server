/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { BankReconciliationService } from './bank-reconciliation_statement.service';
import { CreateBankReconciliationDto } from './dto/create-bank-reconciliation_statement.dto';
import { UpdateBankReconciliationDto } from './dto/update-bank-reconciliation_statement.dto';
import { QueryBankReconciliationDto } from './dto/query-bank-reconciliation_statement.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Accounts | bank-reconciliations | bank-reconciliations-statement")
@Controller('bank-reconciliations')
export class BankReconciliationController {
  constructor(private readonly reconciliationService: BankReconciliationService) {}

  @Post()
  create(@Body() dto: CreateBankReconciliationDto) {
    return this.reconciliationService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryBankReconciliationDto) {
    return this.reconciliationService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.reconciliationService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateBankReconciliationDto) {
    return this.reconciliationService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateBankReconciliationDto) {
    return this.reconciliationService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.reconciliationService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.reconciliationService.restore(uuid);
  }
}