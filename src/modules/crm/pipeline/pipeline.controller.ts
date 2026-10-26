import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { QueryPipelineDto } from './dto/query-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { PipelineService } from './pipeline.service';

@ApiTags('CRM | Lead | Pipeline')
@ApiBearerAuth()
@Controller('crm/lead/pipeline')
export class PipelineController {
  constructor(private readonly service: PipelineService) {}

  @Get('dropdowns/projects')
  @ApiOperation({ summary: 'List existing projects for the CRM pipeline project selector' })
  projectDropdown() { return this.service.projectDropdown(); }

  @Get()
  @ApiOperation({ summary: 'List project pipeline metrics derived from existing CRM leads and requirements' })
  findAll(@Query() query: QueryPipelineDto) { return this.service.findAll(query); }

  @Post()
  @ApiOperation({ summary: 'Create a pipeline record for an existing project' })
  create(@Body() dto: CreatePipelineDto, @Req() req: any) { return this.service.create(dto, req.user?.uuid); }

  @Get(':projectUuid')
  @ApiOperation({ summary: 'Get pipeline metrics for one existing project' })
  findOne(@Param('projectUuid', ParseUUIDPipe) projectUuid: string) { return this.service.findOne(projectUuid); }

  @Patch('entries/:uuid')
  @ApiOperation({ summary: 'Update a pipeline record' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdatePipelineDto, @Req() req: any) { return this.service.update(uuid, dto, req.user?.uuid); }

  @Delete('entries/:uuid')
  @ApiOperation({ summary: 'Soft-delete a pipeline record' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req: any) { return this.service.remove(uuid, req.user?.uuid); }

  @Patch('entries/:uuid/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted pipeline record' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
