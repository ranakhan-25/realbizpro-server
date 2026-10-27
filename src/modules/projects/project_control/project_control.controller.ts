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
import { ProjectControlService } from './project_control.service';
import { CreateProjectControlDto } from './dto/create-project_control.dto';
import { QueryProjectControlDto } from './dto/query-project_control.dto';
import { UpdateProjectControlDto } from './dto/update-project_control.dto';


@Controller('project-controls')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectControlController {
  constructor(private readonly controlService: ProjectControlService) {}

  @Post()
  @Permissions('create_project_control')
  create(@Body() createDto: CreateProjectControlDto) {
    return this.controlService.create(createDto);
  }

  @Get()
  @Permissions('view_project_controls')
  findAll(@Query() query: QueryProjectControlDto) {
    return this.controlService.findAll(query);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  @Permissions('view_project_control_summary')
  getSummary(@Query('projectUuid', ParseUUIDPipe) projectUuid: string) {
    return this.controlService.getSummary(projectUuid);
  }

  @Get(':uuid')
  @Permissions('view_project_control')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.controlService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_control')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectControlDto
  ) {
    return this.controlService.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('delete_project_control')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.controlService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_project_control')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.controlService.restore(uuid);
  }
}