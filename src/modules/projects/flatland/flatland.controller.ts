/* eslint-disable prettier/prettier */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateFlatLandDto } from './dto/create-flatland.dto';
import { QueryFlatLandDto } from './dto/query-flatland.dto';
import { FlatLandService } from './flatland.service';
import { UpdateFlatLandDto } from './dto/update-flatland.dto';

@Controller('flat-land')
export class FlatLandController {
  constructor(private readonly flatLandService: FlatLandService) {}

  @Post()
  create(@Body() dto: CreateFlatLandDto) {
    return this.flatLandService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryFlatLandDto) {
    return this.flatLandService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.flatLandService.findOne(uuid);
  }

  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateFlatLandDto,
  ) {
    return this.flatLandService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.flatLandService.remove(uuid);
  }

  @Post(':uuid/restore')
  restore(@Param('uuid') uuid: string) {
    return this.flatLandService.restore(uuid);
  }
}