import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Patch, Controller, Get, Post, Body, Param, ParseUUIDPipe, Put, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFlatLandDto } from './dto/create-flatland.dto';
import { QueryFlatLandDto } from './dto/query-flatland.dto';
import { FlatLandService } from './flatland.service';
import { UpdateFlatLandDto } from './dto/update-flatland.dto';

type RequestWithUser = Request & { user?: { id?: number } };

@ApiTags('CRM | Property')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('flat-land')
export class FlatLandController {
  constructor(private readonly flatLandService: FlatLandService) {}

  @Post()
  @Permissions('create_projects_flat_land')
  @ApiOperation({ summary: 'Create a flat or land record' })
  create(
    @Body() dto: CreateFlatLandDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_flat_land')
  @ApiOperation({ summary: 'List flat and land records' })
  findAll(
    @Query() query: QueryFlatLandDto, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_flat_land')
  @ApiOperation({ summary: 'Get a flat or land record by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.findOne(uuid, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_projects_flat_land')
  @ApiOperation({ summary: 'Update a flat or land record' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.update(uuid, dto, undefined, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_flat_land')
  @ApiOperation({ summary: 'Soft-delete a flat or land record' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.remove(uuid, undefined, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_flat_land')
  @ApiOperation({ summary: 'Restore a deleted flat or land record' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.restore(uuid, undefined, userId, currentUser);
  }
}
