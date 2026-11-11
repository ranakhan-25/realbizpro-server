import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { BuildingService } from './building.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { QueryBuildingDto } from './dto/query-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Post()
  @Permissions('create_projects_building')
  create(
    @Body() dto: CreateBuildingDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.buildingService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_building')
  findAll(
    @Query() query: QueryBuildingDto, @CurrentUser() currentUser: any
  ) {
    return this.buildingService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_building')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.buildingService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_building')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateBuildingDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.buildingService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_building')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.buildingService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_building')
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.buildingService.restore(uuid, userId, currentUser);
  }
}
