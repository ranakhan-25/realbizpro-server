import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CallCenterFollowUpService } from './call-center-follow-up.service';
import { QueryCallCenterFollowUpDto } from './dto/query-call-center-follow-up.dto';
import { CreateFollowUpActivityDto } from './dto/create-follow-up-activity.dto';
import { UpsertLeadRequirementDto, UpsertPropertyInterestDto } from './dto/lead-detail-actions.dto';
import { CreateNegotiationDto, UpdateNegotiationDto } from './dto/lead-detail-actions.dto';
import { CrmNegotiationStatus } from 'src/database/models/crm/call-center/crm-lead-negotiation.model';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Call Center | Follow Up')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/call-center-follow-up')
export class CallCenterFollowUpController {
  constructor(private readonly service: CallCenterFollowUpService) {}

  @Get('dropdowns')
  @Permissions('property_dropdown_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Get active project, user, stage, communication, requirement and visit dropdowns' })
  dropdowns(@CurrentUser() currentUser: any) {
    return this.service.dropdowns(currentUser);
  }

  @Get('projects/:projectUuid/flat-land')
  @Permissions('property_dropdown_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Get available flat and land inventory for an existing project' })
  propertyDropdown(
    @Param('projectUuid', ParseUUIDPipe) projectUuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.propertyDropdown(projectUuid, currentUser);
  }

  @Get()
  @Permissions('list_crm_call_center_follow_up')
  @ApiOperation({ summary: 'List follow-up call-center rows with date, project, user, activity/lead status, search, and pagination filters' })
  list(
    @Query() query: QueryCallCenterFollowUpDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.list(query, currentUser);
  }

  @Get('leads/:uuid')
  @Permissions('details_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Get lead profile and all detail-tab data for call-center follow-up' })
  details(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.details(uuid, currentUser);
  }

  @Post('leads/:uuid/activities')
  @Permissions('create_activity_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Save a call, follow-up, visit, or note and update stage/junk/sold status' })
  createActivity(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: CreateFollowUpActivityDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.createActivity(uuid, dto, userId, currentUser);
  }

  @Post('leads/:uuid/notes')
  @Permissions('add_note_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Add a note to the lead activity history' })
  @ApiBody({ schema: { type: 'object', properties: { note: { type: 'string' } }, required: ['note'] } })
  addNote(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body('note') note: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.addNote(uuid, note, userId, currentUser);
  }

  @Get('leads/:uuid/requirements')
  @Permissions('requirements_crm_call_center_follow_up')
  @ApiOperation({ summary: 'List property requirements for a lead' })
  requirements(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.listRequirements(uuid, currentUser);
  }

  @Post('leads/:uuid/requirements')
  @Permissions('add_requirement_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Add a property requirement to a lead' })
  addRequirement(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpsertLeadRequirementDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.createRequirement(uuid, dto, userId, currentUser);
  }

  @Patch('leads/:uuid/requirements/:requirementUuid')
  @Permissions('update_requirement_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Update one lead property requirement' })
  updateRequirement(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('requirementUuid', ParseUUIDPipe) requirementUuid: string,
    @Body() dto: UpsertLeadRequirementDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.updateRequirement(uuid, requirementUuid, dto, userId, currentUser);
  }

  @Delete('leads/:uuid/requirements/:requirementUuid')
  @Permissions('delete_requirement_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Soft-delete one lead property requirement' })
  deleteRequirement(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('requirementUuid', ParseUUIDPipe) requirementUuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.deleteRequirement(uuid, requirementUuid, userId, currentUser);
  }

  @Get('leads/:uuid/property-interests')
  @Permissions('interests_crm_call_center_follow_up')
  @ApiOperation({ summary: 'List project and flat/land interests for a lead' })
  interests(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.listInterests(uuid, currentUser);
  }

  @Post('leads/:uuid/property-interests')
  @Permissions('add_interest_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Add a project or flat/land interest to a lead' })
  addInterest(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpsertPropertyInterestDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.createInterest(uuid, dto, userId, currentUser);
  }

  @Patch('leads/:uuid/property-interests/:interestUuid')
  @Permissions('update_interest_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Update a lead property interest' })
  updateInterest(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('interestUuid', ParseUUIDPipe) interestUuid: string,
    @Body() dto: UpsertPropertyInterestDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.updateInterest(uuid, interestUuid, dto, userId, currentUser);
  }

  @Delete('leads/:uuid/property-interests/:interestUuid')
  @Permissions('delete_interest_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Soft-delete a lead property interest' })
  deleteInterest(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('interestUuid', ParseUUIDPipe) interestUuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.deleteInterest(uuid, interestUuid, userId, currentUser);
  }

  @Get('leads/:uuid/negotiations')
  @Permissions('negotiations_crm_call_center_follow_up')
  @ApiOperation({ summary: 'List negotiation rounds with project, flat/land, prices, discount, terms, status, and round number' })
  negotiations(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.listNegotiations(uuid, currentUser);
  }

  @Post('leads/:uuid/negotiations')
  @Permissions('add_negotiation_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Create a price negotiation round for an existing lead, project, and optional property' })
  addNegotiation(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: CreateNegotiationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.createNegotiation(uuid, dto, userId, currentUser);
  }

  @Patch('leads/:uuid/negotiations/:negotiationUuid')
  @Permissions('update_negotiation_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Update a price negotiation round' })
  updateNegotiation(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('negotiationUuid', ParseUUIDPipe) negotiationUuid: string,
    @Body() dto: UpdateNegotiationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.updateNegotiation(uuid, negotiationUuid, dto, userId, currentUser);
  }

  @Delete('leads/:uuid/negotiations/:negotiationUuid')
  @Permissions('delete_negotiation_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Soft-delete a price negotiation round' })
  deleteNegotiation(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('negotiationUuid', ParseUUIDPipe) negotiationUuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.deleteNegotiation(uuid, negotiationUuid, userId, currentUser);
  }

  @Patch('leads/:uuid/negotiations/:negotiationUuid/approve')
  @Permissions('approve_negotiation_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Approve a deal negotiation round' })
  approveNegotiation(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('negotiationUuid', ParseUUIDPipe) negotiationUuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.setNegotiationStatus(uuid, negotiationUuid, CrmNegotiationStatus.APPROVED, userId, currentUser);
  }

  @Patch('leads/:uuid/negotiations/:negotiationUuid/reject')
  @Permissions('reject_negotiation_crm_call_center_follow_up')
  @ApiOperation({ summary: 'Reject a deal negotiation round' })
  rejectNegotiation(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('negotiationUuid', ParseUUIDPipe) negotiationUuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.setNegotiationStatus(uuid, negotiationUuid, CrmNegotiationStatus.REJECTED, userId, currentUser);
  }

  @Get('leads/:uuid/:tab')
  @Permissions('activities_crm_call_center_follow_up')
  @ApiOperation({ summary: 'List upcoming, follow-up, visit, or note activity tab entries' })
  activities(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('tab') tab: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.listActivities(uuid, tab, currentUser);
  }
}
