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
} from '@nestjs/common';
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
    private readonly service: LandInfrastructureService,
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

@ApiTags('Flat Land | Roads')
@ApiBearerAuth()
@Controller('land-infrastructure/roads')
export class LandRoadsController extends ScopedInfrastructureController {
  constructor(service: LandInfrastructureService) {
    super(service, LandInfrastructureKind.ROAD);
  }

  @Post()
  @ApiOperation({ summary: 'Create a project road' })
  create(@Body() dto: CreateLandInfrastructureDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List project roads' })
  findAll(@Query() query: QueryLandInfrastructureDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a project road by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a project road' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLandInfrastructureDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a project road' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}

@ApiTags('Flat Land | Blocks')
@ApiBearerAuth()
@Controller('land-infrastructure/blocks')
export class LandBlocksController extends ScopedInfrastructureController {
  constructor(service: LandInfrastructureService) {
    super(service, LandInfrastructureKind.BLOCK);
  }

  @Post()
  @ApiOperation({ summary: 'Create a project block' })
  create(@Body() dto: CreateLandInfrastructureDto, @Req() request: AuthenticatedRequest) {
    return this.createRecord(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'List project blocks' })
  findAll(@Query() query: QueryLandInfrastructureDto) {
    return this.listRecords(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a project block by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.getRecord(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a project block' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLandInfrastructureDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateRecord(uuid, dto, request);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a project block' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.deleteRecord(uuid);
  }
}
