import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeadStageDto } from './dto/create-lead-stage.dto';
import { QueryLeadStageDto } from './dto/query-lead-stage.dto';
import { UpdateLeadStageDto } from './dto/update-lead-stage.dto';
import { LeadStageService } from './lead-stage.service';

@ApiTags('CRM | Configuration | Lead Stage')
@ApiBearerAuth()
@Controller('crm/configuration/lead-stages')
export class LeadStageController {
  constructor(private readonly service: LeadStageService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM lead stage' })
  create(@Body() dto: CreateLeadStageDto) { return this.service.create(dto); }

  @Get() @ApiOperation({ summary: 'List lead stages with search, status, and pagination filters' })
  findAll(@Query() query: QueryLeadStageDto) { return this.service.findAll(query); }

  @Get('dropdown') @ApiOperation({ summary: 'Get active lead stages for form dropdowns' })
  dropdown() { return this.service.dropdown(); }

  @Get('dropdown/statuses') @ApiOperation({ summary: 'Get lead stage status options' })
  statusDropdown() { return this.service.statusDropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get lead stage details by UUID, including related leads and communication statuses' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a lead stage by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateLeadStageDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete a lead stage by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted lead stage by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
