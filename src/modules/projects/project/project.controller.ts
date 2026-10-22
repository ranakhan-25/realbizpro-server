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
} from '@nestjs/common';
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
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // @Get('dashboard/summary')
  // @ApiOperation({ summary: 'Project dashboard summary' })
  // dashboardSummary() {
  //   return this.projectService.getDashboardSummary();
  // }
  @Get('reports/details')
  @ApiOperation({ summary: 'Project details report' })
  detailsReport() {
    return this.projectService.findReport('projects');
  }

  @Get('reports/summary')
  @ApiOperation({ summary: 'Project summary report' })
  summaryReport() {
    return this.projectService.findReport('projects');
  }

  @Get('reports/at-a-glance')
  @ApiOperation({ summary: 'Project at-a-glance report' })
  atAGlanceReport() {
    return this.projectService.findReport('projects');
  }

  @Get('reports/financial')
  @ApiOperation({ summary: 'Project budget report' })
  financialReport() {
    return this.projectService.findReport('projects');
  }

  @Get('reports/progress')
  @ApiOperation({ summary: 'Project progress report' })
  progressReport() {
    return this.projectService.findReport('projects');
  }

  @Get('reports/income/project-wise')
  @ApiOperation({ summary: 'Project-wise income report' })
  projectIncomeReport() {
    return this.projectService.findProjectIncomeReport();
  }

  @Get('reports/income/site-wise')
  @ApiOperation({ summary: 'Site-wise project report' })
  siteIncomeReport() {
    return this.projectService.findSiteIncomeReport();
  }

  @Get(':uuid/members')
  @ApiOperation({ summary: 'List project team members' })
  findMembers(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.findMembers(uuid);
  }

  @Post(':uuid/members')
  @ApiOperation({ summary: 'Add a member to a project' })
  createMember(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: CreateProjectTeamMemberDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.createMember(uuid, dto, request.user?.id);
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
  @ApiOperation({ summary: 'Create a project' })
  create(
    @Body() dto: CreateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.create(dto, request.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List projects' })
  findAll(@Query() query: QueryProjectDto) {
    return this.projectService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a project by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a project (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.update(uuid, dto, request.user?.id);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a project (PATCH)' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft-delete a project' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectService.remove(uuid, request.user?.id);
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore a deleted project' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.restore(uuid);
  }
}
