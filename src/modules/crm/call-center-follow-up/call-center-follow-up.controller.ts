import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CallCenterFollowUpService } from './call-center-follow-up.service';
import { QueryCallCenterFollowUpDto } from './dto/query-call-center-follow-up.dto';
import { CreateFollowUpActivityDto } from './dto/create-follow-up-activity.dto';
import { UpsertLeadRequirementDto, UpsertPropertyInterestDto } from './dto/lead-detail-actions.dto';
import { CreateNegotiationDto, UpdateNegotiationDto } from './dto/lead-detail-actions.dto';
import { CrmNegotiationStatus } from 'src/database/models/crm/call-center/crm-lead-negotiation.model';

@ApiTags('CRM | Call Center | Follow Up')
@ApiBearerAuth()
@Controller('crm/call-center-follow-up')
export class CallCenterFollowUpController {
  constructor(private readonly service: CallCenterFollowUpService) {}

  @Get('dropdowns') @ApiOperation({ summary: 'Get active project, user, stage, communication, requirement and visit dropdowns' }) dropdowns() { return this.service.dropdowns(); }
  @Get('projects/:projectUuid/flat-land') @ApiOperation({ summary: 'Get available flat and land inventory for an existing project' }) propertyDropdown(@Param('projectUuid', ParseUUIDPipe) projectUuid: string) { return this.service.propertyDropdown(projectUuid); }
  @Get() @ApiOperation({ summary: 'List follow-up call-center rows with date, project, user, activity/lead status, search, and pagination filters' }) list(@Query() query: QueryCallCenterFollowUpDto) { return this.service.list(query); }
  @Get('leads/:uuid') @ApiOperation({ summary: 'Get lead profile and all detail-tab data for call-center follow-up' }) details(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.details(uuid); }
  @Post('leads/:uuid/activities') @ApiOperation({ summary: 'Save a call, follow-up, visit, or note and update stage/junk/sold status' }) createActivity(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: CreateFollowUpActivityDto) { return this.service.createActivity(uuid, dto); }
  @Post('leads/:uuid/notes') @ApiOperation({ summary: 'Add a note to the lead activity history' }) @ApiBody({ schema: { type: 'object', properties: { note: { type: 'string' } }, required: ['note'] } }) addNote(@Param('uuid', ParseUUIDPipe) uuid: string, @Body('note') note: string) { return this.service.addNote(uuid, note); }

  @Get('leads/:uuid/requirements') @ApiOperation({ summary: 'List property requirements for a lead' }) requirements(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.listRequirements(uuid); }
  @Post('leads/:uuid/requirements') @ApiOperation({ summary: 'Add a property requirement to a lead' }) addRequirement(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpsertLeadRequirementDto) { return this.service.createRequirement(uuid, dto); }
  @Patch('leads/:uuid/requirements/:requirementUuid') @ApiOperation({ summary: 'Update one lead property requirement' }) updateRequirement(@Param('uuid', ParseUUIDPipe) uuid: string, @Param('requirementUuid', ParseUUIDPipe) requirementUuid: string, @Body() dto: UpsertLeadRequirementDto) { return this.service.updateRequirement(uuid, requirementUuid, dto); }
  @Delete('leads/:uuid/requirements/:requirementUuid') @ApiOperation({ summary: 'Soft-delete one lead property requirement' }) deleteRequirement(@Param('uuid', ParseUUIDPipe) uuid: string, @Param('requirementUuid', ParseUUIDPipe) requirementUuid: string) { return this.service.deleteRequirement(uuid, requirementUuid); }

  @Get('leads/:uuid/property-interests') @ApiOperation({ summary: 'List project and flat/land interests for a lead' }) interests(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.listInterests(uuid); }
  @Post('leads/:uuid/property-interests') @ApiOperation({ summary: 'Add a project or flat/land interest to a lead' }) addInterest(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpsertPropertyInterestDto) { return this.service.createInterest(uuid, dto); }
  @Patch('leads/:uuid/property-interests/:interestUuid') @ApiOperation({ summary: 'Update a lead property interest' }) updateInterest(@Param('uuid', ParseUUIDPipe) uuid: string, @Param('interestUuid', ParseUUIDPipe) interestUuid: string, @Body() dto: UpsertPropertyInterestDto) { return this.service.updateInterest(uuid, interestUuid, dto); }
  @Delete('leads/:uuid/property-interests/:interestUuid') @ApiOperation({ summary: 'Soft-delete a lead property interest' }) deleteInterest(@Param('uuid', ParseUUIDPipe) uuid: string, @Param('interestUuid', ParseUUIDPipe) interestUuid: string) { return this.service.deleteInterest(uuid, interestUuid); }

  @Get('leads/:uuid/negotiations') @ApiOperation({ summary: 'List negotiation rounds with project, flat/land, prices, discount, terms, status, and round number' }) negotiations(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.listNegotiations(uuid); }
  @Post('leads/:uuid/negotiations') @ApiOperation({ summary: 'Create a price negotiation round for an existing lead, project, and optional property' }) addNegotiation(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: CreateNegotiationDto) { return this.service.createNegotiation(uuid, dto); }
  @Patch('leads/:uuid/negotiations/:negotiationUuid') @ApiOperation({ summary: 'Update a price negotiation round' }) updateNegotiation(@Param('uuid', ParseUUIDPipe) uuid: string, @Param('negotiationUuid', ParseUUIDPipe) negotiationUuid: string, @Body() dto: UpdateNegotiationDto) { return this.service.updateNegotiation(uuid, negotiationUuid, dto); }
  @Delete('leads/:uuid/negotiations/:negotiationUuid') @ApiOperation({ summary: 'Soft-delete a price negotiation round' }) deleteNegotiation(@Param('uuid', ParseUUIDPipe) uuid: string, @Param('negotiationUuid', ParseUUIDPipe) negotiationUuid: string) { return this.service.deleteNegotiation(uuid, negotiationUuid); }
  @Patch('leads/:uuid/negotiations/:negotiationUuid/approve') @ApiOperation({ summary: 'Approve a deal negotiation round' }) approveNegotiation(@Param('uuid', ParseUUIDPipe) uuid: string, @Param('negotiationUuid', ParseUUIDPipe) negotiationUuid: string) { return this.service.setNegotiationStatus(uuid, negotiationUuid, CrmNegotiationStatus.APPROVED); }
  @Patch('leads/:uuid/negotiations/:negotiationUuid/reject') @ApiOperation({ summary: 'Reject a deal negotiation round' }) rejectNegotiation(@Param('uuid', ParseUUIDPipe) uuid: string, @Param('negotiationUuid', ParseUUIDPipe) negotiationUuid: string) { return this.service.setNegotiationStatus(uuid, negotiationUuid, CrmNegotiationStatus.REJECTED); }
  @Get('leads/:uuid/:tab') @ApiOperation({ summary: 'List upcoming, follow-up, visit, or note activity tab entries' }) activities(@Param('uuid', ParseUUIDPipe) uuid: string, @Param('tab') tab: string) { return this.service.listActivities(uuid, tab); }
}
