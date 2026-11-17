import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Put, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFlatLandDto } from './dto/create-flatland.dto';
import { QueryFlatLandDto } from './dto/query-flatland.dto';
import { UpdateFlatLandDto } from './dto/update-flatland.dto';
import { FlatLandService } from './flatland.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('CRM | Property | Flat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('flat-land/flats')
export class FlatRecordsController {
  constructor(private readonly flatLandService: FlatLandService) {}

  @Post()
  @Permissions('create_projects_flat_records')
  @ApiOperation({ summary: 'Create a flat' })
  create(
    @Body() dto: CreateFlatLandDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.create({ ...dto, propertyType: 'flat' }, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_flat_records')
  @ApiOperation({ summary: 'List flats' })
  findAll(
    @Query() query: QueryFlatLandDto, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.findAll(query, 'flat', currentUser);
  }

  @Get('dropdowns')
  @Permissions('read_projects_flat_records')
  @ApiOperation({ summary: 'Get flat form filter and related entity dropdown data' })
  dropdowns(
    @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.dropdowns();
  }

  @Get(':uuid')
  @Permissions('read_projects_flat_records')
  @ApiOperation({ summary: 'Get a flat by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.findOne(uuid, 'flat', currentUser);
  }

  @Put(':uuid')
  @Permissions('update_projects_flat_records')
  @ApiOperation({ summary: 'Update a flat (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.update(uuid, dto, userId, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_flat_records')
  @ApiOperation({ summary: 'Update a flat' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.update(
      uuid,
      { ...dto, propertyType: 'flat' },
      'flat',
      userId,
      currentUser,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_projects_flat_records')
  @ApiOperation({ summary: 'Delete a flat' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.remove(uuid, 'flat', userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_flat_records')
  @ApiOperation({ summary: 'Restore a deleted flat' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.restore(uuid, 'flat', userId, currentUser);
  }
}

@ApiTags('CRM | Property | Land')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('flat-land/lands')
export class FlatLandDetailsController {
  constructor(private readonly flatLandService: FlatLandService) {}

  @Post()
  @Permissions('create_projects_flat_land_details')
  @ApiOperation({ summary: 'Create a land plot' })
  create(
    @Body() dto: CreateFlatLandDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.create({ ...dto, propertyType: 'land' }, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_flat_land_details')
  @ApiOperation({ summary: 'List land plots' })
  findAll(
    @Query() query: QueryFlatLandDto, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.findAll(query, 'land', currentUser);
  }

  @Get('dropdowns')
  @Permissions('read_projects_flat_land_details')
  @ApiOperation({ summary: 'Get land form project, site, road, block, and status dropdown data' })
  dropdowns(
    @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.dropdowns();
  }

  @Get(':uuid')
  @Permissions('read_projects_flat_land_details')
  @ApiOperation({ summary: 'Get a land plot by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.findOne(uuid, 'land', currentUser);
  }

  @Put(':uuid')
  @Permissions('update_projects_flat_land_details')
  @ApiOperation({ summary: 'Update a land plot (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.update(uuid, dto, userId, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_flat_land_details')
  @ApiOperation({ summary: 'Update a land plot' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.update(
      uuid,
      { ...dto, propertyType: 'land' },
      'land',
      userId,
      currentUser,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_projects_flat_land_details')
  @ApiOperation({ summary: 'Delete a land plot' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.remove(uuid, 'land', userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_flat_land_details')
  @ApiOperation({ summary: 'Restore a deleted land plot' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.flatLandService.restore(uuid, 'land', userId, currentUser);
  }
}
