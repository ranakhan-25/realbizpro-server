/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFlatLandDto } from './dto/create-flatland.dto';
import { QueryFlatLandDto } from './dto/query-flatland.dto';
import { UpdateFlatLandDto } from './dto/update-flatland.dto';
import { FlatLandService } from './flatland.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('CRM | Property | Flat')
@ApiBearerAuth()
@Controller('flat-land/flats')
export class FlatRecordsController {
  constructor(private readonly flatLandService: FlatLandService) {}

  @Post()
  @ApiOperation({ summary: 'Create a flat' })
  create(@Body() dto: CreateFlatLandDto, @Req() request: AuthenticatedRequest) {
    return this.flatLandService.create(
      { ...dto, propertyType: 'flat' },
      request.user?.id,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List flats' })
  findAll(@Query() query: QueryFlatLandDto) {
    return this.flatLandService.findAll(query, 'flat');
  }

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get flat form filter and related entity dropdown data' })
  dropdowns() { return this.flatLandService.dropdowns(); }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a flat by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.findOne(uuid, 'flat');
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a flat (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.update(uuid, dto, request);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a flat' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.flatLandService.update(
      uuid,
      { ...dto, propertyType: 'flat' },
      request.user?.id,
      'flat',
    );
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a flat' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.remove(uuid, 'flat');
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore a deleted flat' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.restore(uuid, 'flat');
  }
}

@ApiTags('CRM | Property | Land')
@ApiBearerAuth()
@Controller('flat-land/lands')
export class FlatLandDetailsController {
  constructor(private readonly flatLandService: FlatLandService) {}

  @Post()
  @ApiOperation({ summary: 'Create a land plot' })
  create(@Body() dto: CreateFlatLandDto, @Req() request: AuthenticatedRequest) {
    return this.flatLandService.create(
      { ...dto, propertyType: 'land' },
      request.user?.id,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List land plots' })
  findAll(@Query() query: QueryFlatLandDto) {
    return this.flatLandService.findAll(query, 'land');
  }

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get land form project, site, road, block, and status dropdown data' })
  dropdowns() { return this.flatLandService.dropdowns(); }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a land plot by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.findOne(uuid, 'land');
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a land plot (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.update(uuid, dto, request);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a land plot' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.flatLandService.update(
      uuid,
      { ...dto, propertyType: 'land' },
      request.user?.id,
      'land',
    );
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a land plot' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.remove(uuid, 'land');
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore a deleted land plot' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.restore(uuid, 'land');
  }
}
