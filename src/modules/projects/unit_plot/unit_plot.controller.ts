/* eslint-disable prettier/prettier */

import { 
  Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe 
} from '@nestjs/common';
import { UnitPlotService } from './unit_plot.service';
import { CreateUnitPlotDto } from './dto/create-unit_plot.dto';
import { UpdateUnitPlotDto } from './dto/update-unit_plot.dto';
import { QueryUnitPlotDto } from './dto/query-unit_plot.dto';

@Controller('unit-plots')
export class UnitPlotController {
  constructor(private readonly unitPlotService: UnitPlotService) {}

  @Post()
  create(@Body() dto: CreateUnitPlotDto) {
    return this.unitPlotService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryUnitPlotDto) {
    return this.unitPlotService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.unitPlotService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateUnitPlotDto) {
    return this.unitPlotService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateUnitPlotDto) {
    return this.unitPlotService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.unitPlotService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.unitPlotService.restore(uuid);
  }
}