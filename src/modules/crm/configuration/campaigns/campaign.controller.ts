import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignService } from './campaign.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Campaign')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/campaigns')
export class CampaignController {
  constructor(private readonly service: CampaignService) {}

  @Post()
  @Permissions('create_crm_campaign')
  @ApiOperation({ summary: 'Create a CRM campaign' })
  create(
    @Body() dto: CreateCampaignDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_campaign')
  @ApiOperation({ summary: 'List campaigns with search, source, status, and pagination filters' })
  findAll(
    @Query() query: QueryCampaignDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown/lead-sources')
  @Permissions('read_crm_campaign')
  @ApiOperation({ summary: 'Get active lead sources for campaign form dropdown' })
  leadSourceDropdown(@CurrentUser() currentUser: any) {
    return this.service.leadSourceDropdown(currentUser);
  }

  @Get('dropdown/statuses')
  @Permissions('read_crm_campaign')
  @ApiOperation({ summary: 'Get campaign statuses for campaign form dropdown' })
  statusDropdown() {
    return this.service.statusDropdown();
  }

  @Get(':uuid')
  @Permissions('read_crm_campaign')
  @ApiOperation({ summary: 'Get campaign details by UUID, including lead source and related leads' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_campaign')
  @ApiOperation({ summary: 'Update a CRM campaign by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateCampaignDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_campaign')
  @ApiOperation({ summary: 'Soft delete a CRM campaign by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_campaign')
  @ApiOperation({ summary: 'Restore a soft-deleted CRM campaign by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
