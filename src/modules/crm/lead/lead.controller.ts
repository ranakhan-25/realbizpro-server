import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeadDto } from './dto/create-lead.dto';
import { QueryLeadDto } from './dto/query-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { QueryJunkLeadDto } from './dto/query-junk-lead.dto';
import { JunkLeadActionDto } from './dto/junk-lead-action.dto';
import { QueryTransferLeadListDto } from './dto/query-transfer-lead-list.dto';
import { LeadService } from './lead.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Lead | Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/leads')
export class LeadController {
  constructor(private readonly service: LeadService) {}

  @Post()
  @Permissions('create_crm_lead')
  @ApiOperation({ summary: 'Create a lead' })
  create(
    @Body() dto: CreateLeadDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_lead')
  @ApiOperation({ summary: 'List, search and filter leads' })
  findAll(
    @Query() query: QueryLeadDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('junk')
  @Permissions('find_junk_crm_lead')
  @ApiTags('CRM | Lead | Junk Lead')
  @ApiOperation({ summary: 'List junk leads with date, category, user and search filters' })
  findJunk(
    @Query() query: QueryJunkLeadDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findJunk(query, currentUser);
  }

  @Post('junk')
  @Permissions('mark_junk_crm_lead')
  @ApiTags('CRM | Lead | Junk Lead')
  @ApiOperation({ summary: 'Move selected leads to junk' })
  markJunk(
    @Body() dto: JunkLeadActionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.markJunk(dto, userId, currentUser);
  }

  @Patch('junk/:uuid/restore')
  @Permissions('restore_junk_crm_lead')
  @ApiTags('CRM | Lead | Junk Lead')
  @ApiOperation({ summary: 'Restore a junk lead to active leads' })
  restoreJunk(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restoreJunk(uuid, userId, currentUser);
  }

  @Post('junk/restore')
  @Permissions('bulk_restore_junk_crm_lead')
  @ApiTags('CRM | Lead | Junk Lead')
  @ApiOperation({ summary: 'Restore selected junk leads to active leads' })
  bulkRestoreJunk(
    @Body() dto: JunkLeadActionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.bulkRestoreJunk(dto.ids, dto.uuids, userId, currentUser);
  }

  @Delete('junk/:uuid')
  @Permissions('delete_junk_crm_lead')
  @ApiTags('CRM | Lead | Junk Lead')
  @ApiOperation({ summary: 'Soft delete a junk lead' })
  deleteJunk(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.deleteJunk(uuid, userId, currentUser);
  }

  @Post('junk/delete')
  @Permissions('bulk_delete_junk_crm_lead')
  @ApiTags('CRM | Lead | Junk Lead')
  @ApiOperation({ summary: 'Soft delete selected junk leads' })
  bulkDeleteJunk(
    @Body() dto: JunkLeadActionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.bulkDeleteJunk(dto.ids, dto.uuids, userId, currentUser);
  }

  @Get('dropdown/:entity')
  @Permissions('read_crm_lead')
  @ApiOperation({ summary: 'Get active CRM dropdown records (stages, categories, sources, campaigns, projects, areas, users, professions, teams, statuses)' })
  dropdown(
    @Param('entity') entity: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.dropdown(entity, currentUser);
  }

  @Get('transfer-list/dropdown')
  @Permissions('transfer_lead_list_dropdown_crm_lead')
  @ApiTags('CRM | Lead | Transfer Lead List')
  @ApiOperation({ summary: 'Get active users for the From and To transfer filters' })
  transferLeadListDropdown(@CurrentUser() currentUser: any) {
    return this.service.transferLeadListDropdown(currentUser);
  }

  @Get('transfer-list')
  @Permissions('transfer_lead_list_crm_lead')
  @ApiTags('CRM | Lead | Transfer Lead List')
  @ApiOperation({ summary: 'List transferred leads with date, from/to user, search, and pagination filters' })
  transferLeadList(
    @Query() query: QueryTransferLeadListDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.transferLeadList(query, currentUser);
  }

  @Get('transfer-list/:uuid')
  @Permissions('transfer_lead_list_details_crm_lead')
  @ApiTags('CRM | Lead | Transfer Lead List')
  @ApiOperation({ summary: 'Get transfer lead list record details by UUID' })
  transferLeadListDetails(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.transferLeadListDetails(uuid, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_lead')
  @ApiOperation({ summary: 'Get lead details and related activity, assignment and interest records by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_lead')
  @ApiOperation({ summary: 'Update a lead by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLeadDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_lead')
  @ApiOperation({ summary: 'Soft delete a lead by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_lead')
  @ApiOperation({ summary: 'Restore a soft-deleted lead by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }

  @Post('call-assign')
  @Permissions('call_assign_crm_lead')
  @ApiOperation({ summary: 'Assign one or more leads for calls' })
  callAssign(
    @Body() dto: any,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.callAssign(dto, userId, currentUser);
  }

  @Post('transfer')
  @Permissions('transfer_crm_lead')
  @ApiOperation({ summary: 'Transfer selected leads to users with optional quantity distribution' })
  transfer(
    @Body() dto: any,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.transfer(dto, userId, currentUser);
  }

  @Post('bulk-delete')
  @Permissions('bulk_delete_crm_lead')
  @ApiOperation({ summary: 'Soft delete selected leads' })
  bulkDelete(
    @Body() body: { ids?: number[]; uuids?: string[] },
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.bulkDelete(body.ids ?? [], body.uuids, userId, currentUser);
  }

  @Post('bulk-import')
  @Permissions('bulk_import_crm_lead')
  @ApiOperation({ summary: 'Import leads from JSON rows (file parsing can be handled by clients)' })
  bulkImport(
    @Body('rows') rows: CreateLeadDto[],
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.bulkImport(rows, userId, currentUser);
  }

  @Post(':uuid/activities')
  @Permissions('add_activity_crm_lead')
  @ApiOperation({ summary: 'Add a lead activity using lead UUID' })
  addActivity(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: any,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.addActivity(uuid, dto, userId, currentUser);
  }
}
