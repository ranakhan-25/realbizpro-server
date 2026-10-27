/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
@Controller('project')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // @Get('dashboard/summary')
  // @ApiOperation({ summary: 'Project dashboard summary' })
  // dashboardSummary() {
  //   return this.projectService.getDashboardSummary();
  // }
  @Get('reports/details')
  @Permissions('view_project_reports')
  @ApiOperation({ summary: 'Project details report' })
  detailsReport() {
    return this.projectService.findReport('projects');
  }

  @Get('reports/summary')
  @Permissions('view_project_reports')
  @ApiOperation({ summary: 'Project summary report' })
  summaryReport() {
    return this.projectService.findReport('projects');
  }

  @Get('reports/at-a-glance')
  @Permissions('view_project_reports')
  @ApiOperation({ summary: 'Project at-a-glance report' })
  atAGlanceReport() {
    return this.projectService.findReport('projects');
  }

  @Get('reports/financial')
  @Permissions('view_project_reports')
  @ApiOperation({ summary: 'Project budget report' })
  financialReport() {
    return this.projectService.findReport('projects');
  }

  @Get('reports/progress')
  @Permissions('view_project_reports')
  @ApiOperation({ summary: 'Project progress report' })
  progressReport() {
    return this.projectService.findReport('projects');
  }

  @Get('reports/income/project-wise')
  @Permissions('view_project_reports')
  @ApiOperation({ summary: 'Project-wise income report' })
  projectIncomeReport() {
    return this.projectService.findProjectIncomeReport();
  }

  @Get('reports/income/site-wise')
  @Permissions('view_project_reports')
  @ApiOperation({ summary: 'Site-wise project report' })
  siteIncomeReport() {
    return this.projectService.findSiteIncomeReport();
  }

  @Get(':uuid/members')
  @Permissions('view_project_members')
  @ApiOperation({ summary: 'List project team members' })
  findMembers(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.findMembers(uuid);
  }

  @Post(':uuid/members')
  @Permissions('create_project_member')
  @ApiOperation({ summary: 'Add a member to a project' })
  createMember(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: CreateProjectTeamMemberDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.createMember(uuid, dto, request.user?.id);
  }

  @Patch(':uuid/members/:memberUuid')
  @Permissions('update_project_member')
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
  @Permissions('delete_project_member')
  @ApiOperation({ summary: 'Remove a member from a project' })
  removeMember(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('memberUuid', ParseUUIDPipe) memberUuid: string,
  ) {
    return this.projectService.removeMember(uuid, memberUuid);
  }

  @Post()
  @Permissions('create_project')
  @ApiOperation({ summary: 'Create a project' })
  create(
    @Body() dto: CreateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.create(dto, request.user?.id);
  }

  @Get()
  @Permissions('view_projects')
  @ApiOperation({ summary: 'List projects' })
  findAll(@Query() query: QueryProjectDto) {
    return this.projectService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_project')
  @ApiOperation({ summary: 'Get a project by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('update_project')
  @ApiOperation({ summary: 'Update a project (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.update(uuid, dto, request.user?.id);
  }

  @Patch(':uuid')
  @Permissions('update_project')
  @ApiOperation({ summary: 'Update a project (PATCH)' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @Permissions('delete_project')
  @ApiOperation({ summary: 'Soft-delete a project' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.remove(uuid, request.user?.id);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_project')
  @ApiOperation({ summary: 'Restore a deleted project' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.restore(uuid);
  }
}
