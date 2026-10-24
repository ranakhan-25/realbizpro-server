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
import { ProjectControlService } from './project_control.service';
import { CreateProjectControlDto } from './dto/create-project_control.dto';
import { QueryProjectControlDto } from './dto/query-project_control.dto';
import { UpdateProjectControlDto } from './dto/update-project_control.dto';


@Controller('project-controls')
export class ProjectControlController {
  constructor(private readonly controlService: ProjectControlService) {}

  @Post()
  create(@Body() createDto: CreateProjectControlDto) {
    return this.controlService.create(createDto);
  }

  @Get()
  findAll(@Query() query: QueryProjectControlDto) {
    return this.controlService.findAll(query);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  getSummary(@Query('projectUuid', ParseUUIDPipe) projectUuid: string) {
    return this.controlService.getSummary(projectUuid);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.controlService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectControlDto
  ) {
    return this.controlService.update(uuid, updateDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.controlService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.controlService.restore(uuid);
  }
}