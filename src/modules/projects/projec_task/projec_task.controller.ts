import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { QueryProjectTaskDto } from './dto/query-projec_task.dto';
import { CreateProjectTaskDto } from './dto/create-projec_task.dto';
import { ProjectTaskService } from './projec_task.service';
import { UpdateProjectTaskDto } from './dto/update-projec_task.dto';



@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-tasks')
export class ProjectTaskController {
  constructor(private readonly taskService: ProjectTaskService) {}

  @Post()
  @Permissions('create_projects_project_task')
  create(
    @Body() createDto: CreateProjectTaskDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.taskService.create(createDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_task')
  findAll(
    @Query() query: QueryProjectTaskDto, @CurrentUser() currentUser: any
  ) {
    return this.taskService.findAll(query, currentUser);
  }

  @Get(':uid')
  @Permissions('read_projects_project_task')
  findOne(
    @Param('uid', ParseUUIDPipe) uid: string, @CurrentUser() currentUser: any
  ) {
    return this.taskService.findOne(uid, currentUser);
  }

  @Patch(':uid')
  @Permissions('update_projects_project_task')
  update(
    @Param('uid', ParseUUIDPipe) uid: string, 
    @Body() updateDto: UpdateProjectTaskDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.taskService.update(uid, updateDto, userId, currentUser);
  }

  @Delete(':uid')
  @Permissions('delete_projects_project_task')
  remove(
    @Param('uid', ParseUUIDPipe) uid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.taskService.remove(uid, userId, currentUser);
  }

  @Patch(':uid/restore')
  @Permissions('update_projects_project_task')
  restore(
    @Param('uid', ParseUUIDPipe) uid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.taskService.restore(uid, userId, currentUser);
  }
}