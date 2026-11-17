import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProjectSiteDto } from './dto/create-project-site.dto';
import { QueryProjectSiteDto } from './dto/query-project-site.dto';
import { UpdateProjectSiteDto } from './dto/update-project-site.dto';
import { ProjectSiteService } from './project-site.service';

type AuthenticatedRequest = Request & {
  user?: {
    id?: number;
  };
};

@ApiTags('Project | Sites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-sites')
export class ProjectSiteController {
  constructor(
    private readonly projectSiteService: ProjectSiteService,
  ) {}

  @Post()
  @Permissions('create_projects_project_site')
  @ApiOperation({ summary: 'Create a project site' })
  create(
    @Body() dto: CreateProjectSiteDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectSiteService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_site')
  @ApiOperation({ summary: 'List project sites' })
  findAll(
    @Query() query: QueryProjectSiteDto, @CurrentUser() currentUser: any
  ) {
    return this.projectSiteService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_site')
  @ApiOperation({ summary: 'Get a project site by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.projectSiteService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_site')
  @ApiOperation({ summary: 'Update a project site' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectSiteDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectSiteService.update(uuid,
      dto,
      userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_site')
  @ApiOperation({ summary: 'Soft-delete a project site' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectSiteService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_project_site')
  @ApiOperation({ summary: 'Restore a deleted project site' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectSiteService.restore(uuid, userId, currentUser);
  }
}
