import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Project | Task')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  @Post()
  @Permissions('create_projects_task')
  @ApiOperation({
    summary: 'Create a new task',
  })
  create(
    @Body()
    createTaskDto: CreateTaskDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.taskService.create(createTaskDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_task')
  @ApiOperation({
    summary: 'Get all tasks (paginated)',
  })
  findAll(
    @Query()
    query: QueryTaskDto, @CurrentUser() currentUser: any
  ) {
    return this.taskService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_task')
  @ApiOperation({
    summary: 'Get task by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.taskService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_task')
  @ApiOperation({
    summary: 'Update task',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateTaskDto: UpdateTaskDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.taskService.update(uuid,
      updateTaskDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_task')
  @ApiOperation({
    summary:
      'Soft delete task (status → delayed/inactive & destroy)',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.taskService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_task')
  @ApiOperation({
    summary:
      'Restore soft-deleted task (status → in_progress)',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.taskService.restore(uuid, userId, currentUser);
  }
}