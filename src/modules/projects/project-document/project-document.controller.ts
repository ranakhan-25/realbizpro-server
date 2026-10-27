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
@Controller('project-documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectDocumentController {
  constructor(
    private readonly projectDocumentService: ProjectDocumentService,
  ) {}

  @Post()
  @Permissions('create_project_document')
  @ApiOperation({ summary: 'Create a project document record' })
  create(
    @Body() dto: CreateProjectDocumentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectDocumentService.create(dto, request.user?.id);
  }

  @Get()
  @Permissions('view_project_documents')
  @ApiOperation({ summary: 'List project document records' })
  findAll(@Query() query: QueryProjectDocumentDto) {
    return this.projectDocumentService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_project_document')
  @ApiOperation({ summary: 'Get a project document record by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectDocumentService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_document')
  @ApiOperation({ summary: 'Update a project document record' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectDocumentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectDocumentService.update(
      uuid,
      dto,
      request.user?.id,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_project_document')
  @ApiOperation({ summary: 'Soft-delete a project document record' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectDocumentService.remove(uuid);
  }
}
