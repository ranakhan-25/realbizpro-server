/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ChequeRangeService } from './list_of_cheque_range.service';
import { CreateChequeRangeDto } from './dto/create-list_of_cheque_range.dto';
import { UpdateChequeRangeDto } from './dto/update-list_of_cheque_range.dto';
import { QueryChequeRangeDto } from './dto/query-list_of_cheque_range.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Accounts | bank_reconciliation | list_of_cheque_ranges")
@Controller('cheque-ranges')
export class ChequeRangeController {
  constructor(private readonly chequeRangeService: ChequeRangeService) {}

  @Post()
  create(@Body() dto: CreateChequeRangeDto) {
    return this.chequeRangeService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryChequeRangeDto) {
    return this.chequeRangeService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.chequeRangeService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateChequeRangeDto) {
    return this.chequeRangeService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateChequeRangeDto) {
    return this.chequeRangeService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.chequeRangeService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.chequeRangeService.restore(uuid);
  }
}