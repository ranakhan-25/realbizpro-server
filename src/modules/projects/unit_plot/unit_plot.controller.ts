import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UnitPlotService } from './unit_plot.service';
import { CreateUnitPlotDto } from './dto/create-unit_plot.dto';
import { UpdateUnitPlotDto } from './dto/update-unit_plot.dto';
import { QueryUnitPlotDto } from './dto/query-unit_plot.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('unit-plots')
export class UnitPlotController {
  constructor(private readonly unitPlotService: UnitPlotService) {}

  @Post()
  @Permissions('create_projects_unit_plot')
  create(
    @Body() dto: CreateUnitPlotDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.unitPlotService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_unit_plot')
  findAll(
    @Query() query: QueryUnitPlotDto, @CurrentUser() currentUser: any
  ) {
    return this.unitPlotService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_unit_plot')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.unitPlotService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_unit_plot')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateUnitPlotDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.unitPlotService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_projects_unit_plot')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateUnitPlotDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.unitPlotService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_unit_plot')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.unitPlotService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_unit_plot')
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.unitPlotService.restore(uuid, userId, currentUser);
  }
}