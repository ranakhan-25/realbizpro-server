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
import { CreateLandInfrastructureDto } from './dto/create-land-infrastructure.dto';
import { QueryLandInfrastructureDto } from './dto/query-land-infrastructure.dto';
import { UpdateLandInfrastructureDto } from './dto/update-land-infrastructure.dto';
import { LandInfrastructureService } from './land-infrastructure.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('CRM | Property')
@ApiBearerAuth()
@Controller('land-infrastructure')
export class LandInfrastructureController {
  constructor(
    private readonly infrastructureService: LandInfrastructureService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a project road or block' })
  create(
    @Body() dto: CreateLandInfrastructureDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.infrastructureService.create(dto, request.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List project roads and blocks' })
  findAll(@Query() query: QueryLandInfrastructureDto) {
    return this.infrastructureService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a road or block by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.infrastructureService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a road or block' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLandInfrastructureDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.infrastructureService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft-delete a road or block' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.infrastructureService.remove(uuid);
  }
}
