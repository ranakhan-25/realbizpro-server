/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

import { BuildingService } from './building.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { QueryBuildingDto } from './dto/query-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Controller('building')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Post()
  @Permissions('create_building')
  create(@Body() dto: CreateBuildingDto) {
    return this.buildingService.create(dto);
  }

  @Get()
  @Permissions('view_buildings')
  findAll(@Query() query: QueryBuildingDto) {
    return this.buildingService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_building')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.buildingService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_building')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateBuildingDto,
  ) {
    return this.buildingService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Permissions('delete_building')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.buildingService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_building')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.buildingService.restore(uuid);
  }
}
