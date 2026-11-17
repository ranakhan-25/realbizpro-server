/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discounts_form.service';
import { CreateDiscountDto } from './dto/create-discounts_form.dto';
import { QueryDiscountDto } from './dto/query-discounts_form.dto';
import { UpdateDiscountDto } from './dto/update-discounts_form.dto';

@ApiTags("Discounts | discount_form")
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  create(@Body() dto: CreateDiscountDto) {
    return this.discountService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryDiscountDto) {
    return this.discountService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.discountService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateDiscountDto) {
    return this.discountService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateDiscountDto) {
    return this.discountService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.discountService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.discountService.restore(uuid);
  }
}