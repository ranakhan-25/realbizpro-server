import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeadSourceDto } from './dto/create-lead-source.dto';
import { QueryLeadSourceDto } from './dto/query-lead-source.dto';
import { UpdateLeadSourceDto } from './dto/update-lead-source.dto';
import { LeadSourceService } from './lead-source.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Lead Source')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/lead-sources')
export class LeadSourceController {
  constructor(private readonly service: LeadSourceService) {}

  @Post()
  @Permissions('create_crm_lead_source')
  @ApiOperation({ summary: 'Create a CRM lead source' })
  create(
    @Body() dto: CreateLeadSourceDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_lead_source')
  @ApiOperation({ summary: 'List lead sources with search, status, and pagination filters' })
  findAll(
    @Query() query: QueryLeadSourceDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown')
  @Permissions('read_crm_lead_source')
  @ApiOperation({ summary: 'Get active lead sources for form dropdowns' })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_lead_source')
  @ApiOperation({ summary: 'Get lead source details by UUID, including related leads and campaigns' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_lead_source')
  @ApiOperation({ summary: 'Update a CRM lead source by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLeadSourceDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_lead_source')
  @ApiOperation({ summary: 'Soft delete a CRM lead source by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_lead_source')
  @ApiOperation({ summary: 'Restore a soft-deleted lead source by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
