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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProjectShareConfigurationDto } from './dto/create-project-share-configuration.dto';
import { QueryProjectShareConfigurationDto } from './dto/query-project-share-configuration.dto';
import { UpdateProjectShareConfigurationDto } from './dto/update-project-share-configuration.dto';
import { ProjectShareConfigurationService } from './project-share-configuration.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('Project | Project Share Configuration')
@ApiBearerAuth()
@Controller('project-share-configurations')
export class ProjectShareConfigurationController {
  constructor(
    private readonly configurationService: ProjectShareConfigurationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a project share configuration' })
  create(
    @Body() dto: CreateProjectShareConfigurationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.configurationService.create(dto, request.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List project share configurations' })
  findAll(@Query() query: QueryProjectShareConfigurationDto) {
    return this.configurationService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a project share configuration by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.configurationService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a project share configuration' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectShareConfigurationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.configurationService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft-delete a project share configuration' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.configurationService.remove(uuid);
  }
}
