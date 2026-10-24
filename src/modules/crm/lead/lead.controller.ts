import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeadDto } from './dto/create-lead.dto';
import { QueryLeadDto } from './dto/query-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { QueryJunkLeadDto } from './dto/query-junk-lead.dto';
import { JunkLeadActionDto } from './dto/junk-lead-action.dto';
import { QueryCallHistoryDto } from './dto/query-call-history.dto';
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
  @Patch('junk/:id/restore') @ApiTags('CRM | Lead | Junk Lead') @ApiOperation({ summary: 'Restore a junk lead to active leads' }) restoreJunk(@Param('id', ParseIntPipe) id: number) { return this.service.restoreJunk(id); }
  @Post('junk/restore') @ApiTags('CRM | Lead | Junk Lead') @ApiOperation({ summary: 'Restore selected junk leads to active leads' }) bulkRestoreJunk(@Body() dto: JunkLeadActionDto) { return this.service.bulkRestoreJunk(dto.ids); }
  @Delete('junk/:id') @ApiTags('CRM | Lead | Junk Lead') @ApiOperation({ summary: 'Soft delete a junk lead' }) deleteJunk(@Param('id', ParseIntPipe) id: number) { return this.service.deleteJunk(id); }
  @Post('junk/delete') @ApiTags('CRM | Lead | Junk Lead') @ApiOperation({ summary: 'Soft delete selected junk leads' }) bulkDeleteJunk(@Body() dto: JunkLeadActionDto) { return this.service.bulkDeleteJunk(dto.ids); }
  @Get('dropdown/:entity') @ApiOperation({ summary: 'Get active CRM dropdown records (stages, categories, sources, campaigns, projects, areas, users, professions, teams, statuses)' }) dropdown(@Param('entity') entity: string) { return this.service.dropdown(entity); }
  @Get('call-history') @ApiTags('CRM | Lead | Call History') @ApiOperation({ summary: 'List lead call assignment history with date, user, search, and pagination filters' }) callHistory(@Query() query: QueryCallHistoryDto) { return this.service.callHistory(query); }
  @Get('call-history/:id') @ApiTags('CRM | Lead | Call History') @ApiOperation({ summary: 'Get call history record details' }) callHistoryDetails(@Param('id', ParseIntPipe) id: number) { return this.service.callHistoryDetails(id); }
  @Get(':id') @ApiOperation({ summary: 'Get lead details and related activity, assignment and interest records' }) findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') @ApiOperation({ summary: 'Update a lead' }) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLeadDto) { return this.service.update(id, dto); }
  @Delete(':id') @ApiOperation({ summary: 'Soft delete a lead' }) remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
  @Patch(':id/restore') @ApiOperation({ summary: 'Restore a soft-deleted lead' }) restore(@Param('id', ParseIntPipe) id: number) { return this.service.restore(id); }
  @Post('call-assign') @ApiOperation({ summary: 'Assign one or more leads for calls' }) callAssign(@Body() dto: any) { return this.service.callAssign(dto); }
  @Post('transfer') @ApiOperation({ summary: 'Transfer selected leads to users with optional quantity distribution' }) transfer(@Body() dto: any) { return this.service.transfer(dto); }
  @Post('bulk-delete') @ApiOperation({ summary: 'Soft delete selected leads' }) bulkDelete(@Body('ids') ids: number[]) { return this.service.bulkDelete(ids); }
  @Post('bulk-import') @ApiOperation({ summary: 'Import leads from JSON rows (file parsing can be handled by clients)' }) bulkImport(@Body('rows') rows: CreateLeadDto[]) { return this.service.bulkImport(rows); }
  @Post(':id/activities') @ApiOperation({ summary: 'Add a lead activity' }) addActivity(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.service.addActivity(id, dto); }
}
