import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';
import { CreateProjectTeamMemberDto } from './dto/create-project-team-member.dto';
import { UpdateProjectTeamMemberDto } from './dto/update-project-team-member.dto';

type AuthenticatedRequest = Request & {
  user?: {
    id?: number;
  };
};

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // @Get('dashboard/summary')
  // @ApiOperation({ summary: 'Project dashboard summary' })
  // dashboardSummary() {
  //   return this.projectService.getDashboardSummary();
  // }
  @Get('reports/details')
  @Permissions('read_projects_project')
  @ApiOperation({ summary: 'Project details report' })
  detailsReport(
    @CurrentUser() currentUser: any
  ) {
    return this.projectService.findReport('projects', currentUser);
  }

  @Get('reports/summary')
  @Permissions('read_projects_project')
  @ApiOperation({ summary: 'Project summary report' })
  summaryReport(
    @CurrentUser() currentUser: any
  ) {
    return this.projectService.findReport('projects', currentUser);
  }

  @Get('reports/at-a-glance')
  @Permissions('read_projects_project')
  @ApiOperation({ summary: 'Project at-a-glance report' })
  atAGlanceReport(
    @CurrentUser() currentUser: any
  ) {
    return this.projectService.findReport('projects', currentUser);
  }

  @Get('reports/financial')
  @Permissions('read_projects_project')
  @ApiOperation({ summary: 'Project budget report' })
  financialReport(
    @CurrentUser() currentUser: any
  ) {
    return this.projectService.findReport('projects', currentUser);
  }

  @Get('reports/progress')
  @Permissions('read_projects_project')
  @ApiOperation({ summary: 'Project progress report' })
  progressReport(
    @CurrentUser() currentUser: any
  ) {
    return this.projectService.findReport('projects', currentUser);
  }

  @Get('reports/income/project-wise')
  @Permissions('read_projects_project')
  @ApiOperation({ summary: 'Project-wise income report' })
  projectIncomeReport(
    @CurrentUser() currentUser: any
  ) {
    return this.projectService.findProjectIncomeReport(currentUser);
  }

  @Get('reports/income/site-wise')
  @Permissions('read_projects_project')
  @ApiOperation({ summary: 'Site-wise project report' })
  siteIncomeReport(
    @CurrentUser() currentUser: any
  ) {
    return this.projectService.findSiteIncomeReport(currentUser);
  }

  @Get(':uuid/members')
  @ApiOperation({ summary: 'List project team members' })
  findMembers(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.findMembers(uuid);
  }

  @Post(':uuid/members')
  @Permissions('create_projects_project')
  @ApiOperation({ summary: 'Add a member to a project' })
  createMember(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: CreateProjectTeamMemberDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectService.createMember(uuid, dto, userId, currentUser);
  }

  @Patch(':uuid/members/:memberUuid')
  @ApiOperation({ summary: 'Update a project team member' })
  updateMember(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('memberUuid', ParseUUIDPipe) memberUuid: string,
    @Body() dto: UpdateProjectTeamMemberDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.updateMember(
      uuid,
      memberUuid,
      dto,
      request.user?.id,
    );
  }

  @Delete(':uuid/members/:memberUuid')
  @ApiOperation({ summary: 'Remove a member from a project' })
  removeMember(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('memberUuid', ParseUUIDPipe) memberUuid: string,
  ) {
    return this.projectService.removeMember(uuid, memberUuid);
  }

  @Post()
  @Permissions('create_projects_project')
  @ApiOperation({ summary: 'Create a project' })
  create(
    @Body() dto: CreateProjectDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project')
  @ApiOperation({ summary: 'List projects' })
  findAll(
    @Query() query: QueryProjectDto, @CurrentUser() currentUser: any
  ) {
    return this.projectService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project')
  @ApiOperation({ summary: 'Get a project by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.projectService.findOne(uuid, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_projects_project')
  @ApiOperation({ summary: 'Update a project (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectService.update(uuid, dto, userId, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project')
  @ApiOperation({ summary: 'Update a project (PATCH)' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project')
  @ApiOperation({ summary: 'Soft-delete a project' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.projectService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_project')
  @ApiOperation({ summary: 'Restore a deleted project' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectService.restore(uuid, userId, currentUser);
  }
}
