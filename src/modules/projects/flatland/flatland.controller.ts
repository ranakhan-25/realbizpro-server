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
} from '@nestjs/common';
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
export class FlatLandController {
  constructor(private readonly flatLandService: FlatLandService) {}

  @Post()
  @ApiOperation({ summary: 'Create a flat or land record' })
  create(@Body() dto: CreateFlatLandDto, @Req() request: RequestWithUser) {
    return this.flatLandService.create(dto, request.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List flat and land records' })
  findAll(@Query() query: QueryFlatLandDto) {
    return this.flatLandService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a flat or land record by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a flat or land record' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto,
    @Req() request: RequestWithUser,
  ) {
    return this.flatLandService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft-delete a flat or land record' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.remove(uuid);
  }

  @Post(':uuid/restore')
  @ApiOperation({ summary: 'Restore a deleted flat or land record' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.restore(uuid);
  }
}