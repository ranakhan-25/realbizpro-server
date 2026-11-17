import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProjectShareAssignmentDto } from './dto/create-project-share-assignment.dto';
import { QueryProjectShareAssignmentDto } from './dto/query-project-share-assignment.dto';
import { UpdateProjectShareAssignmentDto } from './dto/update-project-share-assignment.dto';
import { ProjectShareAssignmentService } from './project-share-assignment.service';

type AuthenticatedRequest = Request & {
  user?: { id?: number };
};

@ApiTags('CRM | Property | Share/Package')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-share-assignments')
export class ProjectShareAssignmentController {
  constructor(
    private readonly assignmentService: ProjectShareAssignmentService,
  ) {}

  @Get('reports')
  @Permissions('list_projects_project_share_assignment')
  @ApiOperation({ summary: 'List project share report rows' })
  report(@CurrentUser() currentUser: any) {
    return this.assignmentService.findReport('all', currentUser);
  }

  @Get('reports/collection')
  @Permissions('list_projects_project_share_assignment')
  @ApiOperation({
    summary: 'List share collection report rows',
  })
  collectionReport(
    @CurrentUser() currentUser: any
  ) {
    return this.assignmentService.findReport('collection', currentUser);
  }

  @Get('reports/penalty')
  @Permissions('list_projects_project_share_assignment')
  @ApiOperation({
    summary: 'List share penalty report rows',
  })
  penaltyReport(
    @CurrentUser() currentUser: any
  ) {
    return this.assignmentService.findReport('penalty', currentUser);
  }

  @Get('reports/holders-point')
  @Permissions('list_projects_project_share_assignment')
  @ApiOperation({
    summary:
      'List shareholder points report rows',
  })
  holdersPointReport(
    @CurrentUser() currentUser: any
  ) {
    return this.assignmentService.findReport('holders-point', currentUser);
  }

  @Post()
  @Permissions('create_projects_project_share_assignment')
  @ApiOperation({
    summary: 'Create a share assignment',
  })
  create(
    @Body() dto: CreateProjectShareAssignmentDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.assignmentService.create(dto,
      userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_share_assignment')
  @ApiOperation({
    summary: 'List share assignments',
  })
  findAll(
    @Query()
    query: QueryProjectShareAssignmentDto, @CurrentUser() currentUser: any
  ) {
    return this.assignmentService.findAll(query, currentUser);
  }

  @Get('dropdowns')
  @Permissions('read_projects_project_share_assignment')
  @ApiOperation({ summary: 'Get project, project type, and site dropdown data for share/package records' })
  dropdowns(
    @CurrentUser() currentUser: any
  ) {
    return this.assignmentService.dropdowns();
  }

  @Get(':uuid')
  @Permissions('read_projects_project_share_assignment')
  @ApiOperation({
    summary: 'Get a share assignment by UUID',
  })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.assignmentService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_share_assignment')
  @ApiOperation({
    summary: 'Update a share assignment',
  })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectShareAssignmentDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.assignmentService.update(uuid,
      dto,
      userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_share_assignment')
  @ApiOperation({
    summary: 'Soft-delete a share assignment',
  })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.assignmentService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_project_share_assignment')
  @ApiOperation({ summary: 'Restore a deleted share/package assignment' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.assignmentService.restore(uuid, userId, currentUser);
  }
}
