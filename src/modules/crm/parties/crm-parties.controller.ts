import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssignCrmPartyDto } from './dto/assign-crm-party.dto';
import { CreateCrmPartyCommunicationDto } from './dto/create-crm-party-communication.dto';
import { CreateCrmPartyDto } from './dto/create-crm-party.dto';
import { QueryCrmPartyDto } from './dto/query-crm-party.dto';
import { UpdateCrmPartyDto } from './dto/update-crm-party.dto';
import { CrmPartiesService } from './crm-parties.service';

@ApiTags('CRM | Lead | Parties')
@ApiBearerAuth()
@Controller('crm/parties')
export class CrmPartiesController {
  constructor(private readonly service: CrmPartiesService) {}

  @Get('dropdowns') @ApiOperation({ summary: 'Get party type and status dropdown options' }) dropdowns() { return this.service.dropdowns(); }
  @Get('users/dropdown') @ApiOperation({ summary: 'Get active system users for party assignment' }) assigneeDropdown() { return this.service.assigneeDropdown(); }
  @Get() @ApiOperation({ summary: 'List CRM parties with search, type/status filters, assignee, and pagination' }) findAll(@Query() query: QueryCrmPartyDto) { return this.service.findAll(query); }
  @Post() @ApiOperation({ summary: 'Create a CRM party profile' }) create(@Body() dto: CreateCrmPartyDto, @Req() req: any) { return this.service.create(dto, req.user?.uuid); }
  @Get(':uuid/assignments') @ApiOperation({ summary: 'List party assignment history with assignee and assigning user' }) findAssignments(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findAssignments(uuid); }
  @Post(':uuid/assignments') @ApiOperation({ summary: 'Assign a party to an active user and retain assignment history' }) assign(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: AssignCrmPartyDto, @Req() req: any) { return this.service.assign(uuid, dto, req.user?.uuid); }
  @Get(':uuid/communications') @ApiOperation({ summary: 'List communication history for a party' }) findCommunications(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findCommunications(uuid); }
  @Post(':uuid/communications') @ApiOperation({ summary: 'Log a party communication' }) logCommunication(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: CreateCrmPartyCommunicationDto, @Req() req: any) { return this.service.logCommunication(uuid, dto, req.user?.uuid); }
  @Get(':uuid') @ApiOperation({ summary: 'Get a CRM party profile with assignments and communications' }) findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') @ApiOperation({ summary: 'Update a CRM party profile' }) update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateCrmPartyDto, @Req() req: any) { return this.service.update(uuid, dto, req.user?.uuid); }
  @Delete(':uuid') @ApiOperation({ summary: 'Soft-delete a CRM party profile' }) remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req: any) { return this.service.remove(uuid, req.user?.uuid); }
  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted CRM party profile' }) restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }
}
