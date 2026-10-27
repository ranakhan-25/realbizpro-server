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
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateLandInfrastructureDto } from './dto/create-land-infrastructure.dto';
import { QueryLandInfrastructureDto } from './dto/query-land-infrastructure.dto';
import { UpdateLandInfrastructureDto } from './dto/update-land-infrastructure.dto';
import { LandInfrastructureService } from './land-infrastructure.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('Project | Flat/Land Roads and Blocks')
@ApiBearerAuth()
@Controller('land-infrastructure')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LandInfrastructureController {
  constructor(
    private readonly infrastructureService: LandInfrastructureService,
  ) {}

  @Post()
  @Permissions('create_land_infrastructure')
  @ApiOperation({ summary: 'Create a project road or block' })
  create(
    @Body() dto: CreateLandInfrastructureDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.infrastructureService.create(dto, request.user?.id);
  }

  @Get()
  @Permissions('view_land_infrastructures')
  @ApiOperation({ summary: 'List project roads and blocks' })
  findAll(@Query() query: QueryLandInfrastructureDto) {
    return this.infrastructureService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_land_infrastructure')
  @ApiOperation({ summary: 'Get a road or block by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.infrastructureService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_land_infrastructure')
  @ApiOperation({ summary: 'Update a road or block' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLandInfrastructureDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.infrastructureService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @Permissions('delete_land_infrastructure')
  @ApiOperation({ summary: 'Soft-delete a road or block' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.infrastructureService.remove(uuid);
  }
}
