/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProjectMilestoneService } from './project_milestone.service';
import { CreateProjectMilestoneDto } from './dto/create-project_milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project_milestone.dto';
import { QueryProjectMilestoneDto } from './dto/query-project_milestone.dto';

@Controller('project-milestone')
export class ProjectMilestoneController {
  constructor(private readonly projectMilestoneService: ProjectMilestoneService) {} // ✅ ভেরিয়েবলের নাম মিলিয়ে দেওয়া হলো

  @Post()
  create(@Body() dto: CreateProjectMilestoneDto) {
    return this.projectMilestoneService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryProjectMilestoneDto) {
    return this.projectMilestoneService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectMilestoneService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectMilestoneDto,
  ) {
    return this.projectMilestoneService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectMilestoneDto,
  ) {
    return this.projectMilestoneService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectMilestoneService.remove(uuid);
  }
}