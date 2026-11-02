/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ChequeService } from './list_of_cheque.service';
import { CreateChequeDto } from './dto/create-list_of_cheque.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Account | bank_reconciliation | list of cheque ")
@Controller('cheques')
export class ChequeController {
  constructor(private readonly chequeService: ChequeService) {}

  @Post()
  create(@Body() dto: CreateChequeDto) {
    return this.chequeService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.chequeService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.chequeService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: any) {
    return this.chequeService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: any) {
    return this.chequeService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.chequeService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.chequeService.restore(uuid);
  }
}