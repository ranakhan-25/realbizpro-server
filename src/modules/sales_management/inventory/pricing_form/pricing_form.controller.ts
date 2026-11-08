/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { PropertyPricingService } from './pricing_form.service';
import { CreatePropertyPricingDto } from './dto/create-pricing_form.dto';
import { UpdatePropertyPricingDto } from './dto/update-pricing_form.dto';
import { QueryPropertyPricingDto } from './dto/query-pricing_form.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Sales Management | Inventory| pricings_form")
@Controller('property-pricings')
export class PropertyPricingController {
  constructor(private readonly pricingService: PropertyPricingService) {}

  @Post()
  create(@Body() dto: CreatePropertyPricingDto) {
    return this.pricingService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryPropertyPricingDto) {
    return this.pricingService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.pricingService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdatePropertyPricingDto) {
    return this.pricingService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdatePropertyPricingDto) {
    return this.pricingService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.pricingService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.pricingService.restore(uuid);
  }
}