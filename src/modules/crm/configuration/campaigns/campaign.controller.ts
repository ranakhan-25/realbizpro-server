import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignService } from './campaign.service';

@ApiTags('CRM | Configuration | Campaign')
@ApiBearerAuth()
@Controller('crm/configuration/campaigns')
export class CampaignController {
  constructor(private readonly service: CampaignService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM campaign' })
  create(@Body() dto: CreateCampaignDto) { return this.service.create(dto); }

  @Get() @ApiOperation({ summary: 'List campaigns with search, source, status, and pagination filters' })
  findAll(@Query() query: QueryCampaignDto) { return this.service.findAll(query); }

  @Get('dropdown/lead-sources') @ApiOperation({ summary: 'Get active lead sources for campaign form dropdown' })
  leadSourceDropdown() { return this.service.leadSourceDropdown(); }

  @Get('dropdown/statuses') @ApiOperation({ summary: 'Get campaign statuses for campaign form dropdown' })
  statusDropdown() { return this.service.statusDropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get campaign details by UUID, including lead source and related leads' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update a CRM campaign by UUID' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateCampaignDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete a CRM campaign by UUID' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted CRM campaign by UUID' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
