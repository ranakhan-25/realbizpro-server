import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DealNegotiationActivityService } from './deal-negotiation-activity.service';
import { DealNegotiationNoteDto, ReassignDealNegotiationDto } from './dto/deal-negotiation-action.dto';
import { QueryDealNegotiationActivityDto } from './dto/query-deal-negotiation-activity.dto';

@ApiTags('CRM | Task/visit | Deal Negotiation Activity')
@ApiBearerAuth()
@Controller('crm/task-visit/deal-negotiation-activity')
export class DealNegotiationActivityController {
  constructor(private readonly service: DealNegotiationActivityService) {}

  @Get() @ApiOperation({ summary: 'List deal negotiation activities with Lead, Project, Flat/Land and Creator relations' })
  list(@Query() query: QueryDealNegotiationActivityDto) { return this.service.list(query); }

  @Get(':uuid') @ApiOperation({ summary: 'Get negotiation activity details with all related records' })
  details(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.details(uuid); }

  @Patch(':uuid/approve') @ApiOperation({ summary: 'Approve a pending negotiation and save the approval note' })
  approve(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: DealNegotiationNoteDto) { return this.service.setDecision(uuid, 'approved', dto.note); }

  @Patch(':uuid/reject') @ApiOperation({ summary: 'Reject a negotiation and save the rejection note' })
  reject(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: DealNegotiationNoteDto) { return this.service.setDecision(uuid, 'rejected', dto.note); }

  @Patch(':uuid/reassign') @ApiOperation({ summary: 'Reassign the related lead to an active user and record the assignment note' })
  reassign(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: ReassignDealNegotiationDto) { return this.service.reassign(uuid, dto); }
}
