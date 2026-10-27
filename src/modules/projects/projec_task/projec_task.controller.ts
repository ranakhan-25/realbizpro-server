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
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { QueryProjectTaskDto } from './dto/query-projec_task.dto';
import { CreateProjectTaskDto } from './dto/create-projec_task.dto';
import { ProjectTaskService } from './projec_task.service';
import { UpdateProjectTaskDto } from './dto/update-projec_task.dto';



@Controller('project-tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectTaskController {
  constructor(private readonly taskService: ProjectTaskService) {}

  @Post()
  @Permissions('create_project_task')
  create(@Body() createDto: CreateProjectTaskDto) {
    return this.taskService.create(createDto);
  }

  @Get()
  @Permissions('view_project_tasks')
  findAll(@Query() query: QueryProjectTaskDto) {
    return this.taskService.findAll(query);
  }

  @Get(':uid')
  @Permissions('view_project_task')
  findOne(@Param('uid', ParseUUIDPipe) uid: string) {
    return this.taskService.findOne(uid);
  }

  @Patch(':uid')
  @Permissions('update_project_task')
  update(
    @Param('uid', ParseUUIDPipe) uid: string, 
    @Body() updateDto: UpdateProjectTaskDto
  ) {
    return this.taskService.update(uid, updateDto);
  }

  @Delete(':uid')
  @Permissions('delete_project_task')
  remove(
    @Param('uid', ParseUUIDPipe) uid: string,
    // Note: In a real app, get deletedBy from req.user
    // @Body('deletedBy') deletedBy?: string 
  ) {
    return this.taskService.remove(uid);
  }

  @Patch(':uid/restore')
  @Permissions('restore_project_task')
  restore(@Param('uid', ParseUUIDPipe) uid: string) {
    return this.taskService.restore(uid);
  }
}