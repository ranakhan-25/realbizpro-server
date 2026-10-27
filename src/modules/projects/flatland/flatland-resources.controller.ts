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
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
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
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FlatRecordsController {
  constructor(private readonly flatLandService: FlatLandService) {}

  @Post()
  @Permissions('create_flat')
  @ApiOperation({ summary: 'Create a flat' })
  create(@Body() dto: CreateFlatLandDto, @Req() request: AuthenticatedRequest) {
    return this.flatLandService.create(
      { ...dto, propertyType: 'flat' },
      request.user?.id,
    );
  }

  @Get()
  @Permissions('view_flats')
  @ApiOperation({ summary: 'List flats' })
  findAll(@Query() query: QueryFlatLandDto) {
    return this.flatLandService.findAll(query, 'flat');
  }

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get flat form filter and related entity dropdown data' })
  dropdowns() { return this.flatLandService.dropdowns(); }

  @Get(':uuid')
  @Permissions('view_flat')
  @ApiOperation({ summary: 'Get a flat by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.findOne(uuid, 'flat');
  }

  @Put(':uuid')
  @Permissions('update_flat')
  @ApiOperation({ summary: 'Update a flat (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.update(uuid, dto, request);
  }

  @Patch(':uuid')
  @Permissions('update_flat')
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
  @Permissions('delete_flat')
  @ApiOperation({ summary: 'Delete a flat' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.remove(uuid, 'flat');
  }

  @Patch(':uuid/restore')
  @Permissions('restore_flat')
  @ApiOperation({ summary: 'Restore a deleted flat' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.restore(uuid, 'flat');
  }
}

@ApiTags('CRM | Property | Land')
@ApiBearerAuth()
@Controller('flat-land/lands')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FlatLandDetailsController {
  constructor(private readonly flatLandService: FlatLandService) {}

  @Post()
  @Permissions('create_land_plot')
  @ApiOperation({ summary: 'Create a land plot' })
  create(@Body() dto: CreateFlatLandDto, @Req() request: AuthenticatedRequest) {
    return this.flatLandService.create(
      { ...dto, propertyType: 'land' },
      request.user?.id,
    );
  }

  @Get()
  @Permissions('view_land_plots')
  @ApiOperation({ summary: 'List land plots' })
  findAll(@Query() query: QueryFlatLandDto) {
    return this.flatLandService.findAll(query, 'land');
  }

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get land form project, site, road, block, and status dropdown data' })
  dropdowns() { return this.flatLandService.dropdowns(); }

  @Get(':uuid')
  @Permissions('view_land_plot')
  @ApiOperation({ summary: 'Get a land plot by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.findOne(uuid, 'land');
  }

  @Put(':uuid')
  @Permissions('update_land_plot')
  @ApiOperation({ summary: 'Update a land plot (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.update(uuid, dto, request);
  }

  @Patch(':uuid')
  @Permissions('update_land_plot')
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
  @Permissions('delete_land_plot')
  @ApiOperation({ summary: 'Delete a land plot' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.remove(uuid, 'land');
  }

  @Patch(':uuid/restore')
  @Permissions('restore_land_plot')
  @ApiOperation({ summary: 'Restore a deleted land plot' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.flatLandService.restore(uuid, 'land');
  }
}
