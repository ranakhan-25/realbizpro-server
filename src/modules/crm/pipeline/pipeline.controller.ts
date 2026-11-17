import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { QueryPipelineDto } from './dto/query-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { PipelineService } from './pipeline.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Lead | Pipeline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/lead/pipeline')
export class PipelineController {
  constructor(private readonly service: PipelineService) {}

  @Get('dropdowns/projects')
  @Permissions('project_dropdown_crm_pipeline')
  @ApiOperation({ summary: 'List existing projects for the CRM pipeline project selector' })
  projectDropdown(@CurrentUser() currentUser: any) {
    return this.service.projectDropdown(currentUser);
  }

  @Get()
  @Permissions('list_crm_pipeline')
  @ApiOperation({ summary: 'List project pipeline metrics derived from existing CRM leads and requirements' })
  findAll(
    @Query() query: QueryPipelineDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Post()
  @Permissions('create_crm_pipeline')
  @ApiOperation({ summary: 'Create a pipeline record for an existing project' })
  create(
    @Body() dto: CreatePipelineDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get(':projectUuid')
  @Permissions('read_crm_pipeline')
  @ApiOperation({ summary: 'Get pipeline metrics for one existing project' })
  findOne(
    @Param('projectUuid', ParseUUIDPipe) projectUuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(projectUuid, currentUser);
  }

  @Patch('entries/:uuid')
  @Permissions('update_crm_pipeline')
  @ApiOperation({ summary: 'Update a pipeline record' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdatePipelineDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete('entries/:uuid')
  @Permissions('delete_crm_pipeline')
  @ApiOperation({ summary: 'Soft-delete a pipeline record' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch('entries/:uuid/restore')
  @Permissions('update_crm_pipeline')
  @ApiOperation({ summary: 'Restore a soft-deleted pipeline record' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
