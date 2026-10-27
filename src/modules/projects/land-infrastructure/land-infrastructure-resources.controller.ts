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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
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
    private readonly kind: LandInfrastructureKind,
  ) {}

  protected createRecord(
    dto: CreateLandInfrastructureDto,
    request: AuthenticatedRequest,
  ) {
    return this.service.create(
      { ...dto, kind: this.kind },
      request.user?.id,
    );
  }

  protected listRecords(query: QueryLandInfrastructureDto) {
    return this.service.findAll(query, this.kind);
  }

  protected getRecord(uuid: string) {
    return this.service.findOneByKind(uuid, this.kind);
  }

  protected updateRecord(
    uuid: string,
    dto: UpdateLandInfrastructureDto,
    request: AuthenticatedRequest,
  ) {
    return this.service.update(
      uuid,
      { ...dto, kind: this.kind },
      request.user?.id,
      this.kind,
    );
  }

  protected deleteRecord(uuid: string) {
    return this.service.remove(uuid, this.kind);
  }
}

@ApiTags('CRM | Property | Land | Road')
@ApiBearerAuth()
@Controller('land-infrastructure/roads')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LandRoadsController extends ScopedInfrastructureController {
  constructor(service: LandInfrastructureService) {
    super(service, LandInfrastructureKind.ROAD);
  }

  @Post()
  @Permissions('create_land_road')
  @ApiOperation({ summary: 'Create a project road' })
  create(@Body() dto: CreateLandInfrastructureDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_land_roads')
  @ApiOperation({ summary: 'List project roads' })
  findAll(@Query() query: QueryLandInfrastructureDto) {
    return this.listRecords(query);
  }

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get related project and road dropdown data' })
  dropdowns() { return this.service.dropdowns(LandInfrastructureKind.ROAD); }

  @Get(':uuid')
  @Permissions('view_land_road')
  @ApiOperation({ summary: 'Get a project road by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_land_road')
  @ApiOperation({ summary: 'Update a project road' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLandInfrastructureDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_land_road')
  @ApiOperation({ summary: 'Delete a project road' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore a deleted project road' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid, LandInfrastructureKind.ROAD); }
}

@ApiTags('CRM | Property | Land | Block')
@ApiBearerAuth()
@Controller('land-infrastructure/blocks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LandBlocksController extends ScopedInfrastructureController {
  constructor(service: LandInfrastructureService) {
    super(service, LandInfrastructureKind.BLOCK);
  }

  @Post()
  @Permissions('create_land_block')
  @ApiOperation({ summary: 'Create a project block' })
  create(@Body() dto: CreateLandInfrastructureDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @Permissions('view_land_blocks')
  @ApiOperation({ summary: 'List project blocks' })
  findAll(@Query() query: QueryLandInfrastructureDto) {
    return this.listRecords(query);
  }

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get related project and block dropdown data' })
  dropdowns() { return this.service.dropdowns(LandInfrastructureKind.BLOCK); }

  @Get(':uuid')
  @Permissions('view_land_block')
  @ApiOperation({ summary: 'Get a project block by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_land_block')
  @ApiOperation({ summary: 'Update a project block' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLandInfrastructureDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @Permissions('delete_land_block')
  @ApiOperation({ summary: 'Delete a project block' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore a deleted project block' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid, LandInfrastructureKind.BLOCK); }
}
