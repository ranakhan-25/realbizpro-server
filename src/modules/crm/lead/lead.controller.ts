import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeadDto } from './dto/create-lead.dto';
import { QueryLeadDto } from './dto/query-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { QueryJunkLeadDto } from './dto/query-junk-lead.dto';
import { JunkLeadActionDto } from './dto/junk-lead-action.dto';
import { QueryTransferLeadListDto } from './dto/query-transfer-lead-list.dto';
import { LeadService } from './lead.service';

@ApiTags('CRM | Lead | Leads')
@ApiBearerAuth()
@Controller('crm/leads')
export class LeadController {
  constructor(private readonly service: LeadService) {}

  @Post() @ApiOperation({ summary: 'Create a lead' }) create(@Body() dto: CreateLeadDto) { return this.service.create(dto); }
  @Get() @ApiOperation({ summary: 'List, search and filter leads' }) findAll(@Query() query: QueryLeadDto) { return this.service.findAll(query); }
  @Get('junk') @ApiTags('CRM | Lead | Junk Lead') @ApiOperation({ summary: 'List junk leads with date, category, user and search filters' }) findJunk(@Query() query: QueryJunkLeadDto) { return this.service.findJunk(query); }
  @Post('junk') @ApiTags('CRM | Lead | Junk Lead') @ApiOperation({ summary: 'Move selected leads to junk' }) markJunk(@Body() dto: JunkLeadActionDto) { return this.service.markJunk(dto); }
  @Patch('junk/:uuid/restore') @ApiTags('CRM | Lead | Junk Lead') @ApiOperation({ summary: 'Restore a junk lead to active leads' }) restoreJunk(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restoreJunk(uuid); }
  @Post('junk/restore') @ApiTags('CRM | Lead | Junk Lead') @ApiOperation({ summary: 'Restore selected junk leads to active leads' }) bulkRestoreJunk(@Body() dto: JunkLeadActionDto) { return this.service.bulkRestoreJunk(dto.ids, dto.uuids); }
  @Delete('junk/:uuid') @ApiTags('CRM | Lead | Junk Lead') @ApiOperation({ summary: 'Soft delete a junk lead' }) deleteJunk(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.deleteJunk(uuid); }
  @Post('junk/delete') @ApiTags('CRM | Lead | Junk Lead') @ApiOperation({ summary: 'Soft delete selected junk leads' }) bulkDeleteJunk(@Body() dto: JunkLeadActionDto) { return this.service.bulkDeleteJunk(dto.ids, dto.uuids); }
  @Get('dropdown/:entity') @ApiOperation({ summary: 'Get active CRM dropdown records (stages, categories, sources, campaigns, projects, areas, users, professions, teams, statuses)' }) dropdown(@Param('entity') entity: string) { return this.service.dropdown(entity); }
  @Get('transfer-list/dropdown') @ApiTags('CRM | Lead | Transfer Lead List') @ApiOperation({ summary: 'Get active users for the From and To transfer filters' }) transferLeadListDropdown() { return this.service.transferLeadListDropdown(); }
  @Get('transfer-list') @ApiTags('CRM | Lead | Transfer Lead List') @ApiOperation({ summary: 'List transferred leads with date, from/to user, search, and pagination filters' }) transferLeadList(@Query() query: QueryTransferLeadListDto) { return this.service.transferLeadList(query); }
  @Get('transfer-list/:uuid') @ApiTags('CRM | Lead | Transfer Lead List') @ApiOperation({ summary: 'Get transfer lead list record details by UUID' }) transferLeadListDetails(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.transferLeadListDetails(uuid); }
  @Get(':uuid') @ApiOperation({ summary: 'Get lead details and related activity, assignment and interest records by UUID' }) findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') @ApiOperation({ summary: 'Update a lead by UUID' }) update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateLeadDto) { return this.service.update(uuid, dto); }
  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete a lead by UUID' }) remove(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.remove(uuid); }
  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted lead by UUID' }) restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
  @Post('call-assign') @ApiOperation({ summary: 'Assign one or more leads for calls' }) callAssign(@Body() dto: any) { return this.service.callAssign(dto); }
  @Post('transfer') @ApiOperation({ summary: 'Transfer selected leads to users with optional quantity distribution' }) transfer(@Body() dto: any) { return this.service.transfer(dto); }
  @Post('bulk-delete') @ApiOperation({ summary: 'Soft delete selected leads' }) bulkDelete(@Body() body: { ids?: number[]; uuids?: string[] }) { return this.service.bulkDelete(body.ids ?? [], body.uuids); }
  @Post('bulk-import') @ApiOperation({ summary: 'Import leads from JSON rows (file parsing can be handled by clients)' }) bulkImport(@Body('rows') rows: CreateLeadDto[]) { return this.service.bulkImport(rows); }
  @Post(':uuid/activities') @ApiOperation({ summary: 'Add a lead activity using lead UUID' }) addActivity(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: any) { return this.service.addActivity(uuid, dto); }
}
