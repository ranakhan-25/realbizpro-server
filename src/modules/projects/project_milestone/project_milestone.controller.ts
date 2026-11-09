import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProjectMilestoneService } from './project_milestone.service';
import { CreateProjectMilestoneDto } from './dto/create-project_milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project_milestone.dto';
import { QueryProjectMilestoneDto } from './dto/query-project_milestone.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-milestone')
export class ProjectMilestoneController {
  constructor(private readonly projectMilestoneService: ProjectMilestoneService) {} // ✅ ভেরিয়েবলের নাম মিলিয়ে দেওয়া হলো

  @Post()
  @Permissions('create_projects_project_milestone')
  create(
    @Body() dto: CreateProjectMilestoneDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectMilestoneService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_milestone')
  findAll(
    @Query() query: QueryProjectMilestoneDto, @CurrentUser() currentUser: any
  ) {
    return this.projectMilestoneService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_milestone')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.projectMilestoneService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_milestone')
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectMilestoneDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectMilestoneService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_projects_project_milestone')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectMilestoneDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectMilestoneService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_milestone')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectMilestoneService.remove(uuid, userId, currentUser);
  }
}