/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CreateContraVoucherDto } from './dto/create-contra_voucher.dto';
import { QueryContraVoucherDto } from './dto/query-contra_voucher.dto';
import { ContraVoucherService } from './contra_vouchers.service';
import { UpdateContraVoucherDto } from './dto/update-contra_voucher.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Accounts | vouchers |contra-vouchers")
@Controller('contra-vouchers')
export class ContraVoucherController {
  constructor(private readonly voucherService: ContraVoucherService) {}

  @Post()
  create(@Body() dto: CreateContraVoucherDto) {
    return this.voucherService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryContraVoucherDto) {
    return this.voucherService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.voucherService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateContraVoucherDto) {
    return this.voucherService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateContraVoucherDto) {
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