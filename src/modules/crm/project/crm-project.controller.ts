import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectStatus } from 'src/database/models/projects/project/pr_project.model';
import { CreateProjectDto } from 'src/modules/projects/project/dto/create-project.dto';
import { QueryProjectDto } from 'src/modules/projects/project/dto/query-project.dto';
import { UpdateProjectDto } from 'src/modules/projects/project/dto/update-project.dto';
import { CrmProjectService } from './crm-project.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Project | Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/projects')
export class CrmProjectController {
  constructor(private readonly service: CrmProjectService) {}

  @Get('dropdown')
  @Permissions('read_crm_project')
  @ApiOperation({ summary: 'Get project form dropdown data: types, managers, users, areas, statuses, and existing storey counts' })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get('dropdown/project-types')
  @Permissions('project_type_dropdown_crm_project')
  @ApiOperation({ summary: 'Get existing project types' })
  projectTypeDropdown() {
    return this.service.projectTypeDropdown();
  }

  @Get('dropdown/areas')
  @Permissions('area_dropdown_crm_project')
  @ApiOperation({ summary: 'Get active CRM areas' })
  areaDropdown(@CurrentUser() currentUser: any) {
    return this.service.areaDropdown(currentUser);
  }

  @Get('dropdown/users')
  @Permissions('user_dropdown_crm_project')
  @ApiOperation({ summary: 'Get active users for project manager and assignment selectors' })
  userDropdown() {
    return this.service.userDropdown();
  }

  @Get('dropdown/statuses')
  @Permissions('status_dropdown_crm_project')
  @ApiOperation({ summary: 'Get project status filter options' })
  statusDropdown() {
    return Object.values(ProjectStatus).map(value => ({ value, label: value.replaceAll('_', ' ') }));
  }

  @Get('dropdown/storeys')
  @Permissions('storey_dropdown_crm_project')
  @ApiOperation({ summary: 'Get number of storeys already used by projects' })
  storeyDropdown() {
    return this.service.storeyDropdown();
  }

  @Post()
  @Permissions('create_crm_project')
  @ApiOperation({ summary: 'Create a CRM project (code, name, type, manager, dates, budget, location, area, storeys, status, description, and contact data)' })
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_project')
  @ApiOperation({ summary: 'List projects with filters for type, status, area, storeys, and search' })
  findAll(
    @Query() query: QueryProjectDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_project')
  @ApiOperation({ summary: 'Get a project by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_crm_project')
  @ApiOperation({ summary: 'Replace project fields by UUID' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_project')
  @ApiOperation({ summary: 'Update project fields by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_project')
  @ApiOperation({ summary: 'Soft-delete a project by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_project')
  @ApiOperation({ summary: 'Restore a soft-deleted project by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
