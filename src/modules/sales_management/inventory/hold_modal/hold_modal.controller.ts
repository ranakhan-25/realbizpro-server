/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { HoldPropertyService } from './hold_modal.service';
import { CreateHoldPropertyDto } from './dto/create-hold_modal.dto';
import { UpdateHoldPropertyDto } from './dto/update-hold_modal.dto';
import { QueryHoldPropertyDto } from './dto/query-hold_modal.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Sales Management | Inventory  | hold_modal")
@Controller('hold-properties')
export class HoldPropertyController {
  constructor(private readonly holdService: HoldPropertyService) {}

  @Post()
  create(@Body() dto: CreateHoldPropertyDto) {
    return this.holdService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryHoldPropertyDto) {
    return this.holdService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.holdService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateHoldPropertyDto) {
    return this.holdService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateHoldPropertyDto) {
    return this.holdService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.holdService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.holdService.restore(uuid);
  }
}