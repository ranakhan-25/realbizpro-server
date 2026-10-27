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
} from '@nestjs/common';
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
export class ProjectSiteController {
  constructor(
    private readonly projectSiteService: ProjectSiteService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a project site' })
  create(
    @Body() dto: CreateProjectSiteDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectSiteService.create(dto, request.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List project sites' })
  findAll(@Query() query: QueryProjectSiteDto) {
    return this.projectSiteService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a project site by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectSiteService.findOne(uuid);
  }

  @Patch(':uuid')
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
  @ApiOperation({ summary: 'Soft-delete a project site' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectSiteService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore a deleted project site' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectSiteService.restore(uuid);
  }
}
