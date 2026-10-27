/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Project | Task')
@ApiBearerAuth()
@Controller('task')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  @Post()
  @Permissions('create_project_task')
  @ApiOperation({
    summary: 'Create a new task',
  })
  create(
    @Body()
    createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @Permissions('view_project_tasks')
  @ApiOperation({
    summary: 'Get all tasks (paginated)',
  })
  findAll(
    @Query()
    query: QueryTaskDto,
  ) {
    return this.taskService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_project_task')
  @ApiOperation({
    summary: 'Get task by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.taskService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_task')
  @ApiOperation({
    summary: 'Update task',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(
      uuid,
      updateTaskDto,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_project_task')
  @ApiOperation({
    summary:
      'Soft delete task (status → delayed/inactive & destroy)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.taskService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_project_task')
  @ApiOperation({
    summary:
      'Restore soft-deleted task (status → in_progress)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.taskService.restore(uuid);
  }
}