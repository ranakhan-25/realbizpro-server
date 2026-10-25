import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeadSourceDto } from './dto/create-lead-source.dto';
import { QueryLeadSourceDto } from './dto/query-lead-source.dto';
import { UpdateLeadSourceDto } from './dto/update-lead-source.dto';
import { LeadSourceService } from './lead-source.service';

@ApiTags('CRM | Configuration | Lead Source')
@ApiBearerAuth()
@Controller('crm/configuration/lead-sources')
export class LeadSourceController {
  constructor(private readonly service: LeadSourceService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM lead source' })
  create(@Body() dto: CreateLeadSourceDto) { return this.service.create(dto); }

  @Get() @ApiOperation({ summary: 'List lead sources with search, status, and pagination filters' })
  findAll(@Query() query: QueryLeadSourceDto) { return this.service.findAll(query); }

  @Get('dropdown') @ApiOperation({ summary: 'Get active lead sources for form dropdowns' })
  dropdown() { return this.service.dropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get lead source details by UUID, including related leads and campaigns' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a CRM lead source by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateLeadSourceDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete a CRM lead source by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted lead source by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
