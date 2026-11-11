import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { QueryFloorDto } from './dto/query-floor.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('floor')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post()
  @Permissions('create_floor')
  create(
    @Body() dto: CreateFloorDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.floorService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_floor')
  findAll(
    @Query() query: QueryFloorDto, @CurrentUser() currentUser: any
  ) {
    return this.floorService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_floor')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.floorService.findOne(uuid, currentUser);
  }

  // ✅ PATCH মেথড
  @Patch(':uuid')
  @Permissions('update_floor')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateFloorDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.floorService.update(uuid, dto, userId, currentUser);
  }

  // ✅ PUT মেথড (যদি ফ্রন্টএন্ড PUT পাঠায়)
  @Put(':uuid')
  @Permissions('update_floor')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateFloorDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.floorService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_floor')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.floorService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_floor')
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.floorService.restore(uuid, userId, currentUser);
  }
}