import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProjectShareConfigurationDto } from './dto/create-project-share-configuration.dto';
import { QueryProjectShareConfigurationDto } from './dto/query-project-share-configuration.dto';
import { UpdateProjectShareConfigurationDto } from './dto/update-project-share-configuration.dto';
import { ProjectShareConfigurationService } from './project-share-configuration.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('Project | Project Share Configuration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-share-configurations')
export class ProjectShareConfigurationController {
  constructor(
    private readonly configurationService: ProjectShareConfigurationService,
  ) {}

  @Post()
  @Permissions('create_projects_project_share_configuration')
  @ApiOperation({ summary: 'Create a project share configuration' })
  create(
    @Body() dto: CreateProjectShareConfigurationDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.configurationService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_share_configuration')
  @ApiOperation({ summary: 'List project share configurations' })
  findAll(
    @Query() query: QueryProjectShareConfigurationDto, @CurrentUser() currentUser: any
  ) {
    return this.configurationService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_share_configuration')
  @ApiOperation({ summary: 'Get a project share configuration by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.configurationService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_share_configuration')
  @ApiOperation({ summary: 'Update a project share configuration' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectShareConfigurationDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.configurationService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_share_configuration')
  @ApiOperation({ summary: 'Soft-delete a project share configuration' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.configurationService.remove(uuid, userId, currentUser);
  }
}
