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
} from '@nestjs/common';
import { ProjectProgressService } from './project_progress.service';
import { CreateProjectProgressDto } from './dto/create-project_progress.dto';
import { QueryProjectProgressDto } from './dto/query-project_progress.dto';
import { UpdateProjectProgressDto } from './dto/update-project_progress.dto';

@Controller('project-progress')
export class ProjectProgressController {
  constructor(private readonly progressService: ProjectProgressService) {}

  @Post()
  create(@Body() createDto: CreateProjectProgressDto) {
    return this.progressService.create(createDto);
  }

  @Get()
  findAll(@Query() query: QueryProjectProgressDto) {
    return this.progressService.findAll(query);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  getSummary(@Query('projectUuid', ParseUUIDPipe) projectUuid: string) {
    return this.progressService.getSummary(projectUuid);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.progressService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectProgressDto
  ) {
    return this.progressService.update(uuid, updateDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.progressService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.progressService.restore(uuid);
  }
}