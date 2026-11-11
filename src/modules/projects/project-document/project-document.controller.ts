import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProjectDocumentDto } from './dto/create-project-document.dto';
import { QueryProjectDocumentDto } from './dto/query-project-document.dto';
import { UpdateProjectDocumentDto } from './dto/update-project-document.dto';
import { ProjectDocumentService } from './project-document.service';

type AuthenticatedRequest = Request & {
  user?: {
    id?: number;
  };
};

@ApiTags('Project | Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('project-documents')
export class ProjectDocumentController {
  constructor(
    private readonly projectDocumentService: ProjectDocumentService,
  ) {}

  @Post()
  @Permissions('create_projects_project_document')
  @ApiOperation({ summary: 'Create a project document record' })
  create(
    @Body() dto: CreateProjectDocumentDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectDocumentService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_project_document')
  @ApiOperation({ summary: 'List project document records' })
  findAll(
    @Query() query: QueryProjectDocumentDto, @CurrentUser() currentUser: any
  ) {
    return this.projectDocumentService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_project_document')
  @ApiOperation({ summary: 'Get a project document record by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.projectDocumentService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_project_document')
  @ApiOperation({ summary: 'Update a project document record' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectDocumentDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectDocumentService.update(uuid,
      dto,
      userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_project_document')
  @ApiOperation({ summary: 'Soft-delete a project document record' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.projectDocumentService.remove(uuid, userId, currentUser);
  }
}
