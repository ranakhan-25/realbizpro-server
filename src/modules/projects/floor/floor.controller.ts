/* eslint-disable prettier/prettier */

import { 
  Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe
} from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { QueryFloorDto } from './dto/query-floor.dto';

@Controller('floor')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post()
  create(@Body() dto: CreateFloorDto) {
    return this.floorService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryFloorDto) {
    return this.floorService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.floorService.findOne(uuid);
  }

  // ✅ PATCH মেথড
  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateFloorDto
  ) {
    return this.floorService.update(uuid, dto);
  }

  // ✅ PUT মেথড (যদি ফ্রন্টএন্ড PUT পাঠায়)
  @Put(':uuid')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateFloorDto
  ) {
    return this.floorService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.floorService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.floorService.restore(uuid);
  }
}