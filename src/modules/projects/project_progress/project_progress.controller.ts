import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProjectProgressService } from './project_progress.service';
import { CreateProjectProgressDto } from './dto/create-project_progress.dto';
import { QueryProjectProgressDto } from './dto/query-project_progress.dto';
import { UpdateProjectProgressDto } from './dto/update-project_progress.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-progress')
export class ProjectProgressController {
  constructor(private readonly progressService: ProjectProgressService) {}

  @Post()
  @Permissions('create_projects_project_progress')
  create(
    @Body() createDto: CreateProjectProgressDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.progressService.create(createDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_progress')
  findAll(
    @Query() query: QueryProjectProgressDto, @CurrentUser() currentUser: any
  ) {
    return this.progressService.findAll(query, currentUser);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  @Permissions('read_projects_project_progress')
  getSummary(
    @Query('projectUuid', ParseUUIDPipe) projectUuid: string, @CurrentUser() currentUser: any
  ) {
    return this.progressService.getSummary(projectUuid, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_progress')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.progressService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_progress')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectProgressDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.progressService.update(uuid, updateDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_progress')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.progressService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_project_progress')
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.progressService.restore(uuid, userId, currentUser);
  }
}