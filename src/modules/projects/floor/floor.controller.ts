/* eslint-disable prettier/prettier */

import { 
  Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { QueryFloorDto } from './dto/query-floor.dto';

@Controller('floor')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post()
  @Permissions('create_floor')
  create(@Body() dto: CreateFloorDto) {
    return this.floorService.create(dto);
  }

  @Get()
  @Permissions('view_floors')
  findAll(@Query() query: QueryFloorDto) {
    return this.floorService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_floor')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.floorService.findOne(uuid);
  }

  // ✅ PATCH মেথড
  @Patch(':uuid')
  @Permissions('update_floor')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateFloorDto
  ) {
    return this.floorService.update(uuid, dto);
  }

  // ✅ PUT মেথড (যদি ফ্রন্টএন্ড PUT পাঠায়)
  @Put(':uuid')
  @Permissions('update_floor')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateFloorDto
  ) {
    return this.floorService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Permissions('delete_floor')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.floorService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_floor')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.floorService.restore(uuid);
  }
}