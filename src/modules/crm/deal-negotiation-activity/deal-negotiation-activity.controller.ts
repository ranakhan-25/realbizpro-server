import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DealNegotiationActivityService } from './deal-negotiation-activity.service';
import { DealNegotiationNoteDto, ReassignDealNegotiationDto } from './dto/deal-negotiation-action.dto';
import { QueryDealNegotiationActivityDto } from './dto/query-deal-negotiation-activity.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Task/visit | Deal Negotiation Activity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/task-visit/deal-negotiation-activity')
export class DealNegotiationActivityController {
  constructor(private readonly service: DealNegotiationActivityService) {}

  @Get()
  @Permissions('list_crm_deal_negotiation_activity')
  @ApiOperation({ summary: 'List deal negotiation activities with Lead, Project, Flat/Land and Creator relations' })
  list(
    @Query() query: QueryDealNegotiationActivityDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.list(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('details_crm_deal_negotiation_activity')
  @ApiOperation({ summary: 'Get negotiation activity details with all related records' })
  details(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.details(uuid, currentUser);
  }

  @Patch(':uuid/approve')
  @Permissions('approve_crm_deal_negotiation_activity')
  @ApiOperation({ summary: 'Approve a pending negotiation and save the approval note' })
  approve(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: DealNegotiationNoteDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.setDecision(uuid, 'approved', dto.note, userId, currentUser);
  }

  @Patch(':uuid/reject')
  @Permissions('reject_crm_deal_negotiation_activity')
  @ApiOperation({ summary: 'Reject a negotiation and save the rejection note' })
  reject(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: DealNegotiationNoteDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.setDecision(uuid, 'rejected', dto.note, userId, currentUser);
  }

  @Patch(':uuid/reassign')
  @Permissions('reassign_crm_deal_negotiation_activity')
  @ApiOperation({ summary: 'Reassign the related lead to an active user and record the assignment note' })
  reassign(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: ReassignDealNegotiationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.reassign(uuid, dto, userId, currentUser);
  }
}
