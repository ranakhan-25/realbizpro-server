/* eslint-disable prettier/prettier */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Put,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFlatLandDto } from './dto/create-flatland.dto';
import { QueryFlatLandDto } from './dto/query-flatland.dto';
import { FlatLandService } from './flatland.service';
import { UpdateFlatLandDto } from './dto/update-flatland.dto';

type RequestWithUser = Request & { user?: { id?: number } };

@ApiTags('Project | Flat Land')
@ApiBearerAuth()
@Controller('flat-land')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FlatLandController {
  constructor(private readonly flatLandService: FlatLandService) {}

  @Post()
  @Permissions('create_flat_land')
  @ApiOperation({ summary: 'Create a flat or land record' })
  create(@Body() dto: CreateFlatLandDto, @Req() request: RequestWithUser) {
    return this.flatLandService.create(dto, request.user?.id);
  }

  @Get()
  @Permissions('view_flat_lands')
  @ApiOperation({ summary: 'List flat and land records' })
  findAll(@Query() query: QueryFlatLandDto) {
    return this.flatLandService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_flat_land')
  @ApiOperation({ summary: 'Get a flat or land record by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('update_flat_land')
  @ApiOperation({ summary: 'Update a flat or land record' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto,
    @Req() request: RequestWithUser,
  ) {
    return this.flatLandService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @Permissions('delete_flat_land')
  @ApiOperation({ summary: 'Soft-delete a flat or land record' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.remove(uuid);
  }

  @Post(':uuid/restore')
  @Permissions('restore_flat_land')
  @ApiOperation({ summary: 'Restore a deleted flat or land record' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.restore(uuid);
  }
}