import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProjectControlService } from './project_control.service';
import { CreateProjectControlDto } from './dto/create-project_control.dto';
import { QueryProjectControlDto } from './dto/query-project_control.dto';
import { UpdateProjectControlDto } from './dto/update-project_control.dto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-controls')
export class ProjectControlController {
  constructor(private readonly controlService: ProjectControlService) {}

  @Post()
  @Permissions('create_projects_project_control')
  create(
    @Body() createDto: CreateProjectControlDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.controlService.create(createDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_control')
  findAll(
    @Query() query: QueryProjectControlDto, @CurrentUser() currentUser: any
  ) {
    return this.controlService.findAll(query, currentUser);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  @Permissions('read_projects_project_control')
  getSummary(
    @Query('projectUuid', ParseUUIDPipe) projectUuid: string, @CurrentUser() currentUser: any
  ) {
    return this.controlService.getSummary(projectUuid, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_control')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.controlService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_control')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectControlDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.controlService.update(uuid, updateDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_control')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.controlService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_project_control')
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.controlService.restore(uuid, userId, currentUser);
  }
}