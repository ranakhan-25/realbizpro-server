/* eslint-disable prettier/prettier */

import { 
  Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UnitPlotService } from './unit_plot.service';
import { CreateUnitPlotDto } from './dto/create-unit_plot.dto';
import { UpdateUnitPlotDto } from './dto/update-unit_plot.dto';
import { QueryUnitPlotDto } from './dto/query-unit_plot.dto';

@Controller('unit-plots')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UnitPlotController {
  constructor(private readonly unitPlotService: UnitPlotService) {}

  @Post()
  @Permissions('create_unit_plot')
  create(@Body() dto: CreateUnitPlotDto) {
    return this.unitPlotService.create(dto);
  }

  @Get()
  @Permissions('view_unit_plots')
  findAll(@Query() query: QueryUnitPlotDto) {
    return this.unitPlotService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_unit_plot')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.unitPlotService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_unit_plot')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateUnitPlotDto) {
    return this.unitPlotService.update(uuid, dto);
  }

  @Put(':uuid')
  @Permissions('update_unit_plot')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateUnitPlotDto) {
    return this.unitPlotService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Permissions('delete_unit_plot')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.unitPlotService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_unit_plot')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.unitPlotService.restore(uuid);
  }
}