/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CreateJournalVoucherDto } from './dto/create-journal_voucher.dto';
import { JournalVoucherService } from './journal_vouchers.service';
import { QueryJournalVoucherDto } from './dto/query-contra_voucher.dto';
import { UpdateJournalVoucherDto } from './dto/update-journal_voucher.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Accounts | Vouchers |journal-vouchers ")
@Controller('journal-vouchers')
export class JournalVoucherController {
  constructor(private readonly voucherService: JournalVoucherService) {}

  @Post()
  create(@Body() dto: CreateJournalVoucherDto) {
    return this.voucherService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryJournalVoucherDto) {
    return this.voucherService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.voucherService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateJournalVoucherDto) {
    return this.voucherService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateJournalVoucherDto) {
    return this.voucherService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.voucherService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.voucherService.restore(uuid);
  }
}