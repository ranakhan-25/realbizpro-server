import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import {
  LandInfrastructureKind,
} from 'src/database/models/projects/land-infrastructure/pr_land_infrastructure.model';
import { CreateLandInfrastructureDto } from './dto/create-land-infrastructure.dto';
import { QueryLandInfrastructureDto } from './dto/query-land-infrastructure.dto';
import { UpdateLandInfrastructureDto } from './dto/update-land-infrastructure.dto';
import { LandInfrastructureService } from './land-infrastructure.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

abstract class ScopedInfrastructureController {
  protected constructor(
    protected readonly service: LandInfrastructureService,
    protected readonly kind: LandInfrastructureKind,
  ) {}

  protected createRecord(
    dto: CreateLandInfrastructureDto,
    userId?: number,
    currentUser?: any,
  ) {
    return this.service.create(
      { ...dto, kind: this.kind },
      userId,
      currentUser,
    );
  }

  protected listRecords(query: QueryLandInfrastructureDto, currentUser?: any) {
    return this.service.findAll(query, this.kind, currentUser);
  }

  protected getRecord(uuid: string, currentUser?: any) {
    return this.service.findOneByKind(uuid, this.kind, currentUser);
  }

  protected updateRecord(
    uuid: string,
    dto: UpdateLandInfrastructureDto,
    userId?: number,
    currentUser?: any,
  ) {
    return this.service.update(
      uuid,
      { ...dto, kind: this.kind },
      this.kind,
      userId,
      currentUser,
    );
  }

  protected deleteRecord(uuid: string, userId?: number, currentUser?: any) {
    return this.service.remove(uuid, this.kind, userId, currentUser);
  }

  protected restoreRecord(uuid: string, userId?: number, currentUser?: any) {
    return this.service.restore(uuid, this.kind, userId, currentUser);
  }
}

@ApiTags('CRM | Property | Land | Road')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('land-infrastructure/roads')
export class LandRoadsController extends ScopedInfrastructureController {
  constructor(service: LandInfrastructureService) {
    super(service, LandInfrastructureKind.ROAD);
  }

  @Post()
  @Permissions('create_projects_land_roads')
  @ApiOperation({ summary: 'Create a project road' })
  create(
    @Body() dto: CreateLandInfrastructureDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_land_roads')
  @ApiOperation({ summary: 'List project roads' })
  findAll(
    @Query() query: QueryLandInfrastructureDto, @CurrentUser() currentUser: any
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get('dropdowns')
  @Permissions('read_projects_land_roads')
  @ApiOperation({ summary: 'Get related project and road dropdown data' })
  dropdowns(
    @CurrentUser() currentUser: any
  ) {
    return this.service.dropdowns(this.kind);
  }

  @Get(':uuid')
  @Permissions('read_projects_land_roads')
  @ApiOperation({ summary: 'Get a project road by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_land_roads')
  @ApiOperation({ summary: 'Update a project road' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLandInfrastructureDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_land_roads')
  @ApiOperation({ summary: 'Delete a project road' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_land_roads')
  @ApiOperation({ summary: 'Restore a deleted project road' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.service.restore(uuid, LandInfrastructureKind.ROAD, userId, currentUser);
  }
}

@ApiTags('CRM | Property | Land | Block')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('land-infrastructure/blocks')
export class LandBlocksController extends ScopedInfrastructureController {
  constructor(service: LandInfrastructureService) {
    super(service, LandInfrastructureKind.BLOCK);
  }

  @Post()
  @Permissions('create_projects_land_blocks')
  @ApiOperation({ summary: 'Create a project block' })
  create(
    @Body() dto: CreateLandInfrastructureDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.createRecord(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_land_blocks')
  @ApiOperation({ summary: 'List project blocks' })
  findAll(
    @Query() query: QueryLandInfrastructureDto, @CurrentUser() currentUser: any
  ) {
    return this.listRecords(query, currentUser);
  }

  @Get('dropdowns')
  @Permissions('read_projects_land_blocks')
  @ApiOperation({ summary: 'Get related project and block dropdown data' })
  dropdowns(
    @CurrentUser() currentUser: any
  ) {
    return this.service.dropdowns(this.kind);
  }

  @Get(':uuid')
  @Permissions('read_projects_land_blocks')
  @ApiOperation({ summary: 'Get a project block by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.getRecord(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_land_blocks')
  @ApiOperation({ summary: 'Update a project block' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLandInfrastructureDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.updateRecord(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_land_blocks')
  @ApiOperation({ summary: 'Delete a project block' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.deleteRecord(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_land_blocks')
  @ApiOperation({ summary: 'Restore a deleted project block' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.service.restore(uuid, LandInfrastructureKind.BLOCK, userId, currentUser);
  }
}
