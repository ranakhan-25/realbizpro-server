import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import { CustomerServiceCommunicationService } from './customer-service-communication.service';
import {
  QueryCommunicationInboxDto,
  CreateCommunicationMessageDto,
  QuerySiteVisitsDto,
  CreateSiteVisitDto,
  UpdateSiteVisitStatusDto,
  QueryCustomerFeedbackDto,
  CreateCustomerFeedbackDto,
  UpdateCustomerFeedbackDto,
} from './dto';

@ApiTags('Customer Service | Communication & Appointments')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-organization-id',
  description: 'Optional organization ID override for Super Admin write operations',
  required: false,
})
@UseGuards(JwtAuthGuard, CustomerServiceTenantGuard)
@Controller('customer-service/communication')
export class CustomerServiceCommunicationController {
  constructor(
    private readonly commService: CustomerServiceCommunicationService,
  ) {}

  // -------------------------------------------------------------------------
  // 0. SHARED OVERVIEW & DROPDOWNS
  // -------------------------------------------------------------------------

  @Get('overview')
  @ApiOperation({
    summary: 'Executive cross-channel communication & stakeholder overview metrics',
  })
  getOverview(
    @Query('project_id') projectId: string | undefined,
    @Request() req: any,
  ) {
    return this.commService.getOverview(projectId, req.user);
  }

  @Get('dropdowns')
  @ApiOperation({
    summary: 'Active projects, staff escorts, communication channels and purpose dropdowns',
  })
  getDropdowns(@Request() req: any) {
    return this.commService.getDropdowns(req.user);
  }

  // -------------------------------------------------------------------------
  // 1. INBOX & REMINDERS
  // -------------------------------------------------------------------------

  @Get('inbox-reminders')
  @ApiOperation({
    summary: 'List communication message logs with channel, status, type and tab filters',
  })
  listMessages(
    @Query() query: QueryCommunicationInboxDto,
    @Request() req: any,
  ) {
    return this.commService.listMessages(query, req.user);
  }

  @Post('inbox-reminders')
  @ApiOperation({
    summary: 'Send or schedule a new communication message to purchaser via SMS/Email/WhatsApp',
  })
  sendMessage(
    @Body() dto: CreateCommunicationMessageDto,
    @Request() req: any,
  ) {
    return this.commService.sendMessage(dto, req.user);
  }

  @Get('inbox-reminders/:id')
  @ApiOperation({
    summary: 'Get communication message log detail by ID, UUID, or reference number',
  })
  getMessage(@Param('id') id: string, @Request() req: any) {
    return this.commService.getMessage(id, req.user);
  }

  @Post('inbox-reminders/:id/resend')
  @ApiOperation({
    summary: 'Resend an existing communication notification to the purchaser',
  })
  resendMessage(@Param('id') id: string, @Request() req: any) {
    return this.commService.resendMessage(id, req.user);
  }

  @Delete('inbox-reminders/:id')
  @ApiOperation({
    summary: 'Delete or cancel a communication log record',
  })
  deleteMessage(@Param('id') id: string, @Request() req: any) {
    return this.commService.deleteMessage(id, req.user);
  }

  // -------------------------------------------------------------------------
  // 2. SITE VISITS & APPOINTMENTS
  // -------------------------------------------------------------------------

  @Get('site-visits')
  @ApiOperation({
    summary: 'List site inspection and walkthrough appointments with date, purpose and status filters',
  })
  listVisits(
    @Query() query: QuerySiteVisitsDto,
    @Request() req: any,
  ) {
    return this.commService.listVisits(query, req.user);
  }

  @Post('site-visits')
  @ApiOperation({
    summary: 'Book a new site inspection or pre-handover walkthrough appointment',
  })
  bookVisit(
    @Body() dto: CreateSiteVisitDto,
    @Request() req: any,
  ) {
    return this.commService.bookVisit(dto, req.user);
  }

  @Get('site-visits/:id')
  @ApiOperation({
    summary: 'Get site appointment detail by ID, UUID, or slot number',
  })
  getVisit(@Param('id') id: string, @Request() req: any) {
    return this.commService.getVisit(id, req.user);
  }

  @Patch('site-visits/:id/status')
  @ApiOperation({
    summary: 'Update appointment status (In Progress, Completed, Rescheduled, Cancelled) and findings',
  })
  updateVisitStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSiteVisitStatusDto,
    @Request() req: any,
  ) {
    return this.commService.updateVisitStatus(id, dto, req.user);
  }

  @Delete('site-visits/:id')
  @ApiOperation({
    summary: 'Cancel and delete a site visit appointment record',
  })
  deleteVisit(@Param('id') id: string, @Request() req: any) {
    return this.commService.deleteVisit(id, req.user);
  }

  // -------------------------------------------------------------------------
  // 3. FEEDBACK & CSAT SURVEYS
  // -------------------------------------------------------------------------

  @Get('feedback-surveys')
  @ApiOperation({
    summary: 'List customer feedback, CSAT scores, and NPS ratings with touchpoint filters',
  })
  listFeedbacks(
    @Query() query: QueryCustomerFeedbackDto,
    @Request() req: any,
  ) {
    return this.commService.listFeedbacks(query, req.user);
  }

  @Post('feedback-surveys')
  @ApiOperation({
    summary: 'Record customer CSAT feedback and calculate NPS category (Promoter, Passive, Detractor)',
  })
  recordFeedback(
    @Body() dto: CreateCustomerFeedbackDto,
    @Request() req: any,
  ) {
    return this.commService.recordFeedback(dto, req.user);
  }

  @Get('feedback-surveys/:id')
  @ApiOperation({
    summary: 'Get customer feedback survey audit detail by ID, UUID, or feedback number',
  })
  getFeedback(@Param('id') id: string, @Request() req: any) {
    return this.commService.getFeedback(id, req.user);
  }

  @Patch('feedback-surveys/:id/status')
  @ApiOperation({
    summary: 'Update feedback follow-up status (Escalated to CX Head, Satisfied - Closed, Action Taken)',
  })
  updateFeedbackStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerFeedbackDto,
    @Request() req: any,
  ) {
    return this.commService.updateFeedbackStatus(id, dto, req.user);
  }

  @Delete('feedback-surveys/:id')
  @ApiOperation({
    summary: 'Delete customer feedback record',
  })
  deleteFeedback(@Param('id') id: string, @Request() req: any) {
    return this.commService.deleteFeedback(id, req.user);
  }
}
