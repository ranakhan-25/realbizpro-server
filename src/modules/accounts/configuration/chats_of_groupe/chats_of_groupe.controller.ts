/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ChartOfGroupService } from './chats_of_groupe.service';
import { CreateChartOfGroupDto } from './dto/create-chats_of_groupe.dto';
import { UpdateChartOfGroupDto } from './dto/update-chats_of_groupe.dto';
import { QueryChartOfGroupDto } from './dto/query-chats_of_groupe.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Accounts | Configuration|chats_of_groups")
@Controller('chart-of-groups')
export class ChartOfGroupController {
  constructor(private readonly groupService: ChartOfGroupService) {}

  @Post()
  create(@Body() dto: CreateChartOfGroupDto) {
    return this.groupService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryChartOfGroupDto) {
    return this.groupService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.groupService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateChartOfGroupDto) {
    return this.groupService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateChartOfGroupDto) {
    return this.groupService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.groupService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.groupService.restore(uuid);
  }
}