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
} from '@nestjs/common';

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
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  @Post()
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
  @ApiOperation({
    summary: 'Get task by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.taskService.findOne(uuid);
  }

  @Patch(':uuid')
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
  @ApiOperation({
    summary:
      'Soft delete task (status → delayed/inactive & destroy)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.taskService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted task (status → in_progress)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.taskService.restore(uuid);
  }
}