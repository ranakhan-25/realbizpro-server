import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProjectCostService } from './project_cost.service';
import { CreateProjectCostDto } from './dto/create-project_cost.dto';
import { QueryProjectCostDto } from './dto/query-project_cost.dto';
import { UpdateProjectCostDto } from './dto/update-project_cost.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-costs')
export class ProjectCostController {
  constructor(private readonly costService: ProjectCostService) {}

  @Post()
  @Permissions('create_projects_project_cost')
  create(
    @Body() createDto: CreateProjectCostDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.costService.create(createDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_cost')
  findAll(
    @Query() query: QueryProjectCostDto, @CurrentUser() currentUser: any
  ) {
    return this.costService.findAll(query, currentUser);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  @Permissions('read_projects_project_cost')
  getSummary(
    @Query('projectUuid', ParseUUIDPipe) projectUuid: string, @CurrentUser() currentUser: any
  ) {
    return this.costService.getSummary(projectUuid, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_cost')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.costService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_cost')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectCostDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.costService.update(uuid, updateDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_cost')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.costService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_project_cost')
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.costService.restore(uuid, userId, currentUser);
  }
}