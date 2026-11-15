import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssignCrmPartyDto } from './dto/assign-crm-party.dto';
import { CreateCrmPartyCommunicationDto } from './dto/create-crm-party-communication.dto';
import { CreateCrmPartyDto } from './dto/create-crm-party.dto';
import { QueryCrmPartyDto } from './dto/query-crm-party.dto';
import { UpdateCrmPartyDto } from './dto/update-crm-party.dto';
import { CrmPartiesService } from './crm-parties.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Lead | Parties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/parties')
export class CrmPartiesController {
  constructor(private readonly service: CrmPartiesService) {}

  @Get('dropdowns')
  @Permissions('read_crm_parties')
  @ApiOperation({ summary: 'Get party type and status dropdown options' })
  dropdowns() {
    return this.service.dropdowns();
  }

  @Get('users/dropdown')
  @Permissions('assignee_dropdown_crm_parties')
  @ApiOperation({ summary: 'Get active system users for party assignment' })
  assigneeDropdown() {
    return this.service.assigneeDropdown();
  }

  @Get()
  @Permissions('list_crm_parties')
  @ApiOperation({ summary: 'List CRM parties with search, type/status filters, assignee, and pagination' })
  findAll(
    @Query() query: QueryCrmPartyDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Post()
  @Permissions('create_crm_parties')
  @ApiOperation({ summary: 'Create a CRM party profile' })
  create(
    @Body() dto: CreateCrmPartyDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get(':uuid/assignments')
  @Permissions('find_assignments_crm_parties')
  @ApiOperation({ summary: 'List party assignment history with assignee and assigning user' })
  findAssignments(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAssignments(uuid, currentUser);
  }

  @Post(':uuid/assignments')
  @Permissions('assign_crm_parties')
  @ApiOperation({ summary: 'Assign a party to an active user and retain assignment history' })
  assign(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: AssignCrmPartyDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.assign(uuid, dto, userId, currentUser);
  }

  @Get(':uuid/communications')
  @Permissions('find_communications_crm_parties')
  @ApiOperation({ summary: 'List communication history for a party' })
  findCommunications(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findCommunications(uuid, currentUser);
  }

  @Post(':uuid/communications')
  @Permissions('log_communication_crm_parties')
  @ApiOperation({ summary: 'Log a party communication' })
  logCommunication(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: CreateCrmPartyCommunicationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.logCommunication(uuid, dto, userId, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_parties')
  @ApiOperation({ summary: 'Get a CRM party profile with assignments and communications' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_parties')
  @ApiOperation({ summary: 'Update a CRM party profile' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateCrmPartyDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_parties')
  @ApiOperation({ summary: 'Soft-delete a CRM party profile' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_parties')
  @ApiOperation({ summary: 'Restore a soft-deleted CRM party profile' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
