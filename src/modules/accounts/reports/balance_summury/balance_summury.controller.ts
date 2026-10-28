/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { BalanceSheetService } from './balance_summury.service';
import { CreateBalanceSheetDto } from './dto/create-balance_summury.dto';
import { UpdateBalanceSheetDto } from './dto/update-balance_summury.dto';
import { QueryBalanceSheetDto } from './dto/query-balance_summury.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Accounts | reports | balance_sheet_summury")
@Controller('balance-sheets')
export class BalanceSheetController {
  constructor(private readonly balanceSheetService: BalanceSheetService) {}

  @Post()
  create(@Body() dto: CreateBalanceSheetDto) {
    return this.balanceSheetService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryBalanceSheetDto) {
    return this.balanceSheetService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.balanceSheetService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateBalanceSheetDto) {
    return this.balanceSheetService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateBalanceSheetDto) {
    return this.balanceSheetService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.balanceSheetService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.balanceSheetService.restore(uuid);
  }
}