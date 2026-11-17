import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProjectPartyService } from './project_party.service';
import { CreateProjectPartyDto } from './dto/create-project_party.dto';
import { QueryProjectPartyDto } from './dto/query-project_party.dto';
import { UpdateProjectPartyDto } from './dto/update-project_party.dto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-parties')
export class ProjectPartyController {
  constructor(private readonly partyService: ProjectPartyService) {}

  @Post()
  @Permissions('create_projects_project_party')
  create(
    @Body() dto: CreateProjectPartyDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.partyService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_party')
  findAll(
    @Query() query: QueryProjectPartyDto, @CurrentUser() currentUser: any
  ) {
    return this.partyService.findAll(query, currentUser);
  }

  @Get('summary')
  @Permissions('read_projects_project_party')
  getSummary(
    @Query('projectUuid', ParseUUIDPipe) projectUuid: string, @CurrentUser() currentUser: any
  ) {
    return this.partyService.getSummary(projectUuid, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_party')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.partyService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_party')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateProjectPartyDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.partyService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_party')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.partyService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_project_party')
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.partyService.restore(uuid, userId, currentUser);
  }
}