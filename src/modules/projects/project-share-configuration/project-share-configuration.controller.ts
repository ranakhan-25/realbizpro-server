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
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectShareConfigurationController {
  constructor(
    private readonly configurationService: ProjectShareConfigurationService,
  ) {}

  @Post()
  @Permissions('create_project_share_configuration')
  @ApiOperation({ summary: 'Create a project share configuration' })
  create(
    @Body() dto: CreateProjectShareConfigurationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.configurationService.create(dto, request.user?.id);
  }

  @Get()
  @Permissions('view_project_share_configurations')
  @ApiOperation({ summary: 'List project share configurations' })
  findAll(@Query() query: QueryProjectShareConfigurationDto) {
    return this.configurationService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_project_share_configuration')
  @ApiOperation({ summary: 'Get a project share configuration by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.configurationService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_share_configuration')
  @ApiOperation({ summary: 'Update a project share configuration' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProjectShareConfigurationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.configurationService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @Permissions('delete_project_share_configuration')
  @ApiOperation({ summary: 'Soft-delete a project share configuration' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.configurationService.remove(uuid);
  }
}
