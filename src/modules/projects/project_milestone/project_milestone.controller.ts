/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ProjectMilestoneService } from './project_milestone.service';
import { CreateProjectMilestoneDto } from './dto/create-project_milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project_milestone.dto';
import { QueryProjectMilestoneDto } from './dto/query-project_milestone.dto';

@Controller('project-milestone')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectMilestoneController {
  constructor(private readonly projectMilestoneService: ProjectMilestoneService) {} // ✅ ভেরিয়েবলের নাম মিলিয়ে দেওয়া হলো

  @Post()
  @Permissions('create_project_milestone')
  create(@Body() dto: CreateProjectMilestoneDto) {
    return this.projectMilestoneService.create(dto);
  }

  @Get()
  @Permissions('view_project_milestones')
  findAll(@Query() query: QueryProjectMilestoneDto) {
    return this.projectMilestoneService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_project_milestone')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectMilestoneService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_milestone')
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectMilestoneDto,
  ) {
    return this.projectMilestoneService.update(uuid, dto);
  }

  @Put(':uuid')
  @Permissions('update_project_milestone')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectMilestoneDto,
  ) {
    return this.projectMilestoneService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Permissions('delete_project_milestone')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectMilestoneService.remove(uuid);
  }
}