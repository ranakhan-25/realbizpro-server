import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ProjectStatus } from 'src/database/models/projects/project/pr_project.model';
import { CreateProjectDto } from 'src/modules/projects/project/dto/create-project.dto';
import { QueryProjectDto } from 'src/modules/projects/project/dto/query-project.dto';
import { UpdateProjectDto } from 'src/modules/projects/project/dto/update-project.dto';
import { CrmProjectService } from './crm-project.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('CRM | Project | Projects')
@ApiBearerAuth()
@Controller('crm/projects')
export class CrmProjectController {
  constructor(private readonly service: CrmProjectService) {}

  @Get('dropdown')
  @ApiOperation({ summary: 'Get project form dropdown data: types, managers, users, areas, statuses, and existing storey counts' })
  dropdown() { return this.service.dropdown(); }

  @Get('dropdown/project-types')
  @ApiOperation({ summary: 'Get existing project types' })
  projectTypeDropdown() { return this.service.projectTypeDropdown(); }

  @Get('dropdown/areas')
  @ApiOperation({ summary: 'Get active CRM areas' })
  areaDropdown() { return this.service.areaDropdown(); }

  @Get('dropdown/users')
  @ApiOperation({ summary: 'Get active users for project manager and assignment selectors' })
  userDropdown() { return this.service.userDropdown(); }

  @Get('dropdown/statuses')
  @ApiOperation({ summary: 'Get project status filter options' })
  statusDropdown() { return Object.values(ProjectStatus).map(value => ({ value, label: value.replaceAll('_', ' ') })); }

  @Get('dropdown/storeys')
  @ApiOperation({ summary: 'Get number of storeys already used by projects' })
  storeyDropdown() { return this.service.storeyDropdown(); }

  @Post()
  @ApiOperation({ summary: 'Create a CRM project (code, name, type, manager, dates, budget, location, area, storeys, status, description, and contact data)' })
  create(@Body() dto: CreateProjectDto, @Req() req: AuthenticatedRequest) { return this.service.create(dto, req.user?.id); }

  @Get()
  @ApiOperation({ summary: 'List projects with filters for type, status, area, storeys, and search' })
  findAll(@Query() query: QueryProjectDto) { return this.service.findAll(query); }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a project by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Put(':uuid')
  @ApiOperation({ summary: 'Replace project fields by UUID' })
  updatePut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateProjectDto, @Req() req: AuthenticatedRequest) { return this.service.update(uuid, dto, req.user?.id); }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update project fields by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateProjectDto, @Req() req: AuthenticatedRequest) { return this.service.update(uuid, dto, req.user?.id); }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft-delete a project by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req: AuthenticatedRequest) { return this.service.remove(uuid, req.user?.id); }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted project by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
