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
import { CreateProjectSiteDto } from './dto/create-project-site.dto';
import { QueryProjectSiteDto } from './dto/query-project-site.dto';
import { UpdateProjectSiteDto } from './dto/update-project-site.dto';
import { ProjectSiteService } from './project-site.service';

type AuthenticatedRequest = Request & {
  user?: {
    id?: number;
  };
};

@ApiTags('Project | Sites')
@ApiBearerAuth()
@Controller('project-sites')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectSiteController {
  constructor(
    private readonly projectSiteService: ProjectSiteService,
  ) {}

  @Post()
  @Permissions('create_project_site')
  @ApiOperation({ summary: 'Create a project site' })
  create(
    @Body() dto: CreateProjectSiteDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectSiteService.create(dto, request.user?.id);
  }

  @Get()
  @Permissions('view_project_sites')
  @ApiOperation({ summary: 'List project sites' })
  findAll(@Query() query: QueryProjectSiteDto) {
    return this.projectSiteService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_project_site')
  @ApiOperation({ summary: 'Get a project site by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectSiteService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_site')
  @ApiOperation({ summary: 'Update a project site' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectSiteDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectSiteService.update(
      uuid,
      dto,
      request.user?.id,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_project_site')
  @ApiOperation({ summary: 'Soft-delete a project site' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectSiteService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_project_site')
  @ApiOperation({ summary: 'Restore a deleted project site' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectSiteService.restore(uuid);
  }
}
