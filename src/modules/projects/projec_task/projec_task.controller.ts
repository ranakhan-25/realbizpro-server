/* eslint-disable prettier/prettier */

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseUUIDPipe 
} from '@nestjs/common';
import { QueryProjectTaskDto } from './dto/query-projec_task.dto';
import { CreateProjectTaskDto } from './dto/create-projec_task.dto';
import { ProjectTaskService } from './projec_task.service';
import { UpdateProjectTaskDto } from './dto/update-projec_task.dto';



@Controller('project-tasks')
export class ProjectTaskController {
  constructor(private readonly taskService: ProjectTaskService) {}

  @Post()
  create(@Body() createDto: CreateProjectTaskDto) {
    return this.taskService.create(createDto);
  }

  @Get()
  findAll(@Query() query: QueryProjectTaskDto) {
    return this.taskService.findAll(query);
  }

  @Get(':uid')
  findOne(@Param('uid', ParseUUIDPipe) uid: string) {
    return this.taskService.findOne(uid);
  }

  @Patch(':uid')
  update(
    @Param('uid', ParseUUIDPipe) uid: string, 
    @Body() updateDto: UpdateProjectTaskDto
  ) {
    return this.taskService.update(uid, updateDto);
  }

  @Delete(':uid')
  remove(
    @Param('uid', ParseUUIDPipe) uid: string,
    // Note: In a real app, get deletedBy from req.user
    // @Body('deletedBy') deletedBy?: string 
  ) {
    return this.taskService.remove(uid);
  }

  @Patch(':uid/restore')
  restore(@Param('uid', ParseUUIDPipe) uid: string) {
    return this.taskService.restore(uid);
  }
}