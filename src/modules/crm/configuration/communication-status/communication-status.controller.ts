import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCommunicationStatusDto } from './dto/create-communication-status.dto';
import { QueryCommunicationStatusDto } from './dto/query-communication-status.dto';
import { UpdateCommunicationStatusDto } from './dto/update-communication-status.dto';
import { CommunicationStatusService } from './communication-status.service';

@ApiTags('CRM | configuration | 1. Communication Status')
@ApiBearerAuth()
@Controller('crm/configuration/communication-status')
export class CommunicationStatusController {
  constructor(private readonly service: CommunicationStatusService) {}

  @Post()
  @ApiOperation({ summary: 'Create communication status' })
  create(@Body() dto: CreateCommunicationStatusDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'List communication statuses with search, filters and pagination' })
  findAll(@Query() query: QueryCommunicationStatusDto) { return this.service.findAll(query); }

  @Get('dropdown')
  @ApiOperation({ summary: 'Get active communication statuses for dropdown' })
  dropdown() { return this.service.dropdown(); }

  @Get('lead-stage-dropdown')
  @ApiOperation({ summary: 'Get active lead stages for communication status dropdown' })
  leadStageDropdown() { return this.service.leadStageDropdown(); }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get communication status details' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update communication status' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateCommunicationStatusDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft delete communication status' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore soft-deleted communication status' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
