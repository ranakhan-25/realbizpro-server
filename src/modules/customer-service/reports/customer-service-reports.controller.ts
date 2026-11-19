import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import { CustomerServiceReportsService } from './customer-service-reports.service';
import {
  QueryCollectionsAgeingDto,
  QueryHandoverPropertyCareDto,
  QueryServiceTicketSlaDto,
  IssueNoticeDto,
  QueryReportSummaryDto,
} from './dto';

@ApiTags('Customer Service | Reports & Analytics')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-organization-id',
  required: false,
  description: 'Target organization ID for Super Admin multi-tenancy override',
})
@UseGuards(JwtAuthGuard, CustomerServiceTenantGuard)
@Controller('customer-service/reports')
export class CustomerServiceReportsController {
  constructor(
    private readonly reportsService: CustomerServiceReportsService,
  ) {}

  // =========================================================================
  // 1. EXECUTIVE REPORT SUMMARY
  // =========================================================================

  @Get('summary')
  @ApiOperation({
    summary: 'Executive Portfolio Summary: Collections, Handover & SLA Reports',
  })
  @ApiResponse({ status: 200, description: 'Executive portfolio report metrics' })
  getExecutiveSummary(
    @Query() query: QueryReportSummaryDto,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.getReportExecutiveSummary(query, user);
  }

  // =========================================================================
  // 2. COLLECTIONS & DUES AGEING REPORT
  // =========================================================================

  @Get('collections-ageing')
  @ApiOperation({
    summary:
      'Collections & Dues Ageing Report with 30/60/90+ day delinquency brackets and surcharges',
  })
  @ApiResponse({
    status: 200,
    description: 'Collections ageing report list, KPIs, and tab counts',
  })
  getCollectionsAgeing(
    @Query() query: QueryCollectionsAgeingDto,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.getCollectionsAgeingReport(query, user);
  }

  @Get('collections-ageing/:id')
  @ApiOperation({
    summary: 'Get single Collections Ageing Statement Breakdown by ID/UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed statement with ledger, delinquency, and notice history',
  })
  getCollectionsAgeingDetail(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.getCollectionsAgeingDetail(id, user);
  }

  @Post('collections-ageing/:id/issue-notice')
  @ApiOperation({
    summary: 'Issue formal statutory recovery notice under Real Estate Act 2010 Section 14',
  })
  @ApiResponse({
    status: 201,
    description: 'Statutory demand notice registered and issued',
  })
  issueCollectionsNotice(
    @Param('id') id: string,
    @Body() dto: IssueNoticeDto,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.issueCollectionsNotice(id, dto, user);
  }

  // =========================================================================
  // 3. HANDOVER & PROPERTY CARE REPORT
  // =========================================================================

  @Get('handover-property-care')
  @ApiOperation({
    summary:
      'Handover & Property Care Report: unit delivery velocity, snags, statutory 2-year DLP, and OA status',
  })
  @ApiResponse({
    status: 200,
    description: 'Project handover & property care audit report',
  })
  getHandoverPropertyCare(
    @Query() query: QueryHandoverPropertyCareDto,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.getHandoverPropertyCareReport(query, user);
  }

  @Get('handover-property-care/:id')
  @ApiOperation({
    summary: 'Get single Project Handover & DLP Care Audit Detail by ID/UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Comprehensive project handover and defect liability audit',
  })
  getHandoverPropertyCareDetail(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.getHandoverPropertyCareDetail(id, user);
  }

  // =========================================================================
  // 4. SERVICE TICKET & SLA PERFORMANCE REPORT
  // =========================================================================

  @Get('service-ticket-sla')
  @ApiOperation({
    summary:
      'Service Ticket & SLA Performance Report: response turnaround, SLA breach audits, and CSAT rating',
  })
  @ApiResponse({
    status: 200,
    description: 'Service ticket SLA adherence metrics and records',
  })
  getServiceTicketSla(
    @Query() query: QueryServiceTicketSlaDto,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.getServiceTicketSlaReport(query, user);
  }

  @Get('service-ticket-sla/:id')
  @ApiOperation({
    summary: 'Get single Service Ticket SLA Audit Detail by TicketNo/ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket SLA compliance audit details and event logs',
  })
  getServiceTicketSlaDetail(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.getServiceTicketSlaDetail(id, user);
  }
}
