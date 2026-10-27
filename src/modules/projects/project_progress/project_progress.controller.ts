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
import { ProjectProgressService } from './project_progress.service';
import { CreateProjectProgressDto } from './dto/create-project_progress.dto';
import { QueryProjectProgressDto } from './dto/query-project_progress.dto';
import { UpdateProjectProgressDto } from './dto/update-project_progress.dto';

@Controller('project-progress')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectProgressController {
  constructor(private readonly progressService: ProjectProgressService) {}

  @Post()
  @Permissions('create_project_progress')
  create(@Body() createDto: CreateProjectProgressDto) {
    return this.progressService.create(createDto);
  }

  @Get()
  @Permissions('view_project_progress')
  findAll(@Query() query: QueryProjectProgressDto) {
    return this.progressService.findAll(query);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  @Permissions('view_project_progress_summary')
  getSummary(@Query('projectUuid', ParseUUIDPipe) projectUuid: string) {
    return this.progressService.getSummary(projectUuid);
  }

  @Get(':uuid')
  @Permissions('view_project_progress_record')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.progressService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_progress')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectProgressDto
  ) {
    return this.progressService.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('delete_project_progress')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.progressService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_project_progress')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.progressService.restore(uuid);
  }
}