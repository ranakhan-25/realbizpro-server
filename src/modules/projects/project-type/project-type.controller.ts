import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { QueryProjectTypeDto } from './dto/query-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { ProjectTypeService } from './project-type.service';

type AuthenticatedRequest = Request & {
  user?: {
    id?: number;
  };
};

@ApiTags('Project | Types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-type')
export class ProjectTypeController {
  constructor(
    private readonly projectTypeService: ProjectTypeService,
  ) {}

  @Post()
  @Permissions('create_projects_project_type')
  @ApiOperation({ summary: 'Create a project type' })
  create(
    @Body() dto: CreateProjectTypeDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectTypeService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_type')
  @ApiOperation({ summary: 'List project types' })
  findAll(
    @Query() query: QueryProjectTypeDto, @CurrentUser() currentUser: any
  ) {
    return this.projectTypeService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_type')
  @ApiOperation({ summary: 'Get a project type by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.projectTypeService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_type')
  @ApiOperation({ summary: 'Update a project type' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectTypeDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectTypeService.update(uuid,
      dto,
      userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_type')
  @ApiOperation({ summary: 'Soft-delete a project type' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectTypeService.remove(uuid, userId, currentUser);
  }
}
