/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { AssetService } from './assets_list.service';
import { CreateAssetDto } from './dto/create-assets_list.dto';
import { QueryAssetDto } from './dto/query-assets_list.dto';
import { UpdateAssetDto } from './dto/update-assets_list.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Accounts | assets | assets_list")
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  create(@Body() dto: CreateAssetDto) {
    return this.assetService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryAssetDto) {
    return this.assetService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.assetService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateAssetDto) {
    return this.assetService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateAssetDto) {
    return this.assetService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.assetService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.assetService.restore(uuid);
  }
}