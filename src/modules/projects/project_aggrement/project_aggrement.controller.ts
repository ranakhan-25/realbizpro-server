import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProjectAgreementService } from './project_aggrement.service';
import { CreateProjectAgreementDto } from './dto/create-project_aggrement.dto';
import { UpdateProjectAgreementDto } from './dto/update-project_aggrement.dto';
import { QueryProjectAgreementDto } from './dto/query-project_aggrement.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-agreement')
export class ProjectAgreementController {
  constructor(private readonly agreementService: ProjectAgreementService) {}

  @Post()
  @Permissions('create_projects_project_agreement')
  create(
    @Body() dto: CreateProjectAgreementDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.agreementService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_agreement')
  findAll(
    @Query() query: QueryProjectAgreementDto, @CurrentUser() currentUser: any
  ) {
    return this.agreementService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_agreement')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.agreementService.findOne(uuid, currentUser);
  }

  // ✅ PATCH সাপোর্ট
  @Patch(':uuid')
  @Permissions('update_projects_project_agreement')
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateProjectAgreementDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.agreementService.update(uuid, dto, userId, currentUser);
  }

  // ✅ PUT সাপোর্ট
  @Put(':uuid')
  @Permissions('update_projects_project_agreement')
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() dto: UpdateProjectAgreementDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.agreementService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_agreement')
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.agreementService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_project_agreement')
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.agreementService.restore(uuid, userId, currentUser);
  }
}