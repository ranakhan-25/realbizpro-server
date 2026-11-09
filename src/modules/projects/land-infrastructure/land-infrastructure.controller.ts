import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateLandInfrastructureDto } from './dto/create-land-infrastructure.dto';
import { QueryLandInfrastructureDto } from './dto/query-land-infrastructure.dto';
import { UpdateLandInfrastructureDto } from './dto/update-land-infrastructure.dto';
import { LandInfrastructureService } from './land-infrastructure.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('CRM | Property')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('land-infrastructure')
export class LandInfrastructureController {
  constructor(
    private readonly infrastructureService: LandInfrastructureService,
  ) {}

  @Post()
  @Permissions('create_projects_land_infrastructure')
  @ApiOperation({ summary: 'Create a project road or block' })
  create(
    @Body() dto: CreateLandInfrastructureDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.infrastructureService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_land_infrastructure')
  @ApiOperation({ summary: 'List project roads and blocks' })
  findAll(
    @Query() query: QueryLandInfrastructureDto, @CurrentUser() currentUser: any
  ) {
    return this.infrastructureService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_land_infrastructure')
  @ApiOperation({ summary: 'Get a road or block by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.infrastructureService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_land_infrastructure')
  @ApiOperation({ summary: 'Update a road or block' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLandInfrastructureDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.infrastructureService.update(uuid, dto, undefined, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_land_infrastructure')
  @ApiOperation({ summary: 'Soft-delete a road or block' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.infrastructureService.remove(uuid, undefined, userId, currentUser);
  }
}
