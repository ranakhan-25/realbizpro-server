import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeadStageDto } from './dto/create-lead-stage.dto';
import { QueryLeadStageDto } from './dto/query-lead-stage.dto';
import { UpdateLeadStageDto } from './dto/update-lead-stage.dto';
import { LeadStageService } from './lead-stage.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Lead Stage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/lead-stages')
export class LeadStageController {
  constructor(private readonly service: LeadStageService) {}

  @Post()
  @Permissions('create_crm_lead_stage')
  @ApiOperation({ summary: 'Create a CRM lead stage' })
  create(
    @Body() dto: CreateLeadStageDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_lead_stage')
  @ApiOperation({ summary: 'List lead stages with search, status, and pagination filters' })
  findAll(
    @Query() query: QueryLeadStageDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown')
  @Permissions('read_crm_lead_stage')
  @ApiOperation({ summary: 'Get active lead stages for form dropdowns' })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get('dropdown/statuses')
  @Permissions('read_crm_lead_stage')
  @ApiOperation({ summary: 'Get lead stage status options' })
  statusDropdown() {
    return this.service.statusDropdown();
  }

  @Get(':uuid')
  @Permissions('read_crm_lead_stage')
  @ApiOperation({ summary: 'Get lead stage details by UUID, including related leads and communication statuses' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_lead_stage')
  @ApiOperation({ summary: 'Update a lead stage by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLeadStageDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_lead_stage')
  @ApiOperation({ summary: 'Soft delete a lead stage by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_lead_stage')
  @ApiOperation({ summary: 'Restore a soft-deleted lead stage by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
