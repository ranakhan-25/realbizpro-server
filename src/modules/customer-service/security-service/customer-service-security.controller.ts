import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { CustomerServiceSecurityService } from './customer-service-security.service';
import {
  CreateSecurityCompanyDto,
  UpdateSecurityCompanyDto,
  QuerySecurityCompanyDto,
  CreateSecurityGuardDto,
  UpdateSecurityGuardDto,
  QuerySecurityGuardDto,
  CreateSecurityRosterDto,
  UpdateSecurityRosterDto,
  UpdateRosterStatusDto,
  QuerySecurityRosterDto,
  CheckInVisitorDto,
  CheckOutVisitorDto,
  QueryVisitorLogDto,
} from './dto';

@ApiTags(
  'Customer Service - Building Services | Security Service',
)
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  CustomerServiceTenantGuard,
)
@Controller('customer-service/security')
export class CustomerServiceSecurityController {
  constructor(
    private readonly securityService: CustomerServiceSecurityService,
  ) {}

  // =========================================================================
  // METRICS & METADATA
  // =========================================================================

  @Get('stats')
  @ApiOperation({
    summary:
      'Get overview KPI statistics for Security Service',
  })
  async getSecurityStats(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.securityService.getSecurityStats(
      user,
      projectId,
    );
  }

  @Get('monthly-cost')
  @ApiOperation({
    summary:
      'Get monthly security cost breakdown (feeds Service Charge expenses)',
  })
  async getMonthlySecurityCost(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.securityService.getMonthlySecurityCost(
      user,
      projectId,
    );
  }

  @Get('dropdown/meta')
  @ApiOperation({
    summary:
      'Get dropdown metadata for security company, guard, and shift selection',
  })
  async getDropdownMeta(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.securityService.getDropdownMeta(
      user,
      projectId,
    );
  }

  // =========================================================================
  // 1. SECURITY COMPANIES
  // =========================================================================

  @Post('companies')
  @ApiOperation({
    summary:
      'Create a new security service company contract',
  })
  async createCompany(
    @CurrentUser() user: any,
    @Body() dto: CreateSecurityCompanyDto,
  ) {
    return this.securityService.createCompany(
      user,
      dto,
    );
  }

  @Get('companies')
  @ApiOperation({
    summary:
      'List security companies with optional search and filters',
  })
  async getCompanies(
    @CurrentUser() user: any,
    @Query() query: QuerySecurityCompanyDto,
  ) {
    return this.securityService.getCompanies(
      user,
      query,
    );
  }

  @Get('companies/expiring')
  @ApiOperation({
    summary:
      'Get contract expiry alerts for security companies (<= 30 days)',
  })
  async getExpiringCompanies(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.securityService.getExpiringCompanies(
      user,
      projectId,
    );
  }

  @Get('companies/:uuid')
  @ApiOperation({
    summary:
      'Get single security company by UUID',
  })
  async getCompanyByUuid(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.securityService.getCompanyByUuid(
      user,
      uuid,
    );
  }

  @Patch('companies/:uuid')
  @ApiOperation({
    summary:
      'Update security company contract details or liability terms',
  })
  async updateCompany(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSecurityCompanyDto,
  ) {
    return this.securityService.updateCompany(
      user,
      uuid,
      dto,
    );
  }

  @Delete('companies/:uuid')
  @ApiOperation({
    summary:
      'Soft delete security company contract',
  })
  async deleteCompany(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.securityService.deleteCompany(
      user,
      uuid,
    );
  }

  // =========================================================================
  // 2. SECURITY GUARDS
  // =========================================================================

  @Post('guards')
  @ApiOperation({
    summary:
      'Register a security guard (validates company_id if source is COMPANY)',
  })
  async createGuard(
    @CurrentUser() user: any,
    @Body() dto: CreateSecurityGuardDto,
  ) {
    return this.securityService.createGuard(
      user,
      dto,
    );
  }

  @Get('guards')
  @ApiOperation({
    summary:
      'List security guards with filters (IN_HOUSE / COMPANY)',
  })
  async getGuards(
    @CurrentUser() user: any,
    @Query() query: QuerySecurityGuardDto,
  ) {
    return this.securityService.getGuards(
      user,
      query,
    );
  }

  @Get('guards/:uuid')
  @ApiOperation({
    summary: 'Get single security guard by UUID',
  })
  async getGuardByUuid(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.securityService.getGuardByUuid(
      user,
      uuid,
    );
  }

  @Patch('guards/:uuid')
  @ApiOperation({
    summary:
      'Update security guard details or status',
  })
  async updateGuard(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSecurityGuardDto,
  ) {
    return this.securityService.updateGuard(
      user,
      uuid,
      dto,
    );
  }

  @Delete('guards/:uuid')
  @ApiOperation({
    summary: 'Soft delete security guard',
  })
  async deleteGuard(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.securityService.deleteGuard(
      user,
      uuid,
    );
  }

  // =========================================================================
  // 3. DUTY ROSTER & SHIFTS
  // =========================================================================

  @Post('rosters')
  @ApiOperation({
    summary:
      'Schedule a guard duty shift (rejects overlapping shifts on same date)',
  })
  async createRoster(
    @CurrentUser() user: any,
    @Body() dto: CreateSecurityRosterDto,
  ) {
    return this.securityService.createRoster(
      user,
      dto,
    );
  }

  @Get('rosters')
  @ApiOperation({
    summary: 'List scheduled duty shifts',
  })
  async getRosters(
    @CurrentUser() user: any,
    @Query() query: QuerySecurityRosterDto,
  ) {
    return this.securityService.getRosters(
      user,
      query,
    );
  }

  @Get('rosters/weekly')
  @ApiOperation({
    summary:
      'Get 7-day weekly roster schedule matrix',
  })
  async getWeeklyRoster(
    @CurrentUser() user: any,
    @Query('project_id') projectId: string,
    @Query('start_date') startDate?: string,
  ) {
    return this.securityService.getWeeklyRoster(
      user,
      projectId,
      startDate,
    );
  }

  @Patch('rosters/:uuid/status')
  @ApiOperation({
    summary:
      'Update guard duty shift status (ON_DUTY, COMPLETED, ABSENT, RELIEVED)',
  })
  async updateRosterStatus(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateRosterStatusDto,
  ) {
    return this.securityService.updateRosterStatus(
      user,
      uuid,
      dto,
    );
  }

  @Patch('rosters/:uuid')
  @ApiOperation({
    summary:
      'Update roster shift post, timings, or guard',
  })
  async updateRoster(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSecurityRosterDto,
  ) {
    return this.securityService.updateRoster(
      user,
      uuid,
      dto,
    );
  }

  @Delete('rosters/:uuid')
  @ApiOperation({
    summary: 'Cancel / delete duty shift',
  })
  async deleteRoster(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.securityService.deleteRoster(
      user,
      uuid,
    );
  }

  // =========================================================================
  // 4. VISITOR LOG
  // =========================================================================

  @Post('visitors/check-in')
  @ApiOperation({
    summary:
      'Check in building visitor / outsider',
  })
  async checkInVisitor(
    @CurrentUser() user: any,
    @Body() dto: CheckInVisitorDto,
  ) {
    return this.securityService.checkInVisitor(
      user,
      dto,
    );
  }

  @Patch('visitors/:uuid/check-out')
  @ApiOperation({
    summary: 'Check out building visitor',
  })
  async checkOutVisitor(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: CheckOutVisitorDto,
  ) {
    return this.securityService.checkOutVisitor(
      user,
      uuid,
      dto,
    );
  }

  @Get('visitors')
  @ApiOperation({
    summary:
      'List visitor log records with search, filter, and pagination',
  })
  async getVisitorLogs(
    @CurrentUser() user: any,
    @Query() query: QueryVisitorLogDto,
  ) {
    return this.securityService.getVisitorLogs(
      user,
      query,
    );
  }

  @Get('visitors/:uuid')
  @ApiOperation({
    summary:
      'Get single visitor log entry by UUID',
  })
  async getVisitorLogByUuid(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.securityService.getVisitorLogByUuid(
      user,
      uuid,
    );
  }

  @Delete('visitors/:uuid')
  @ApiOperation({
    summary: 'Soft delete visitor log entry',
  })
  async deleteVisitorLog(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.securityService.deleteVisitorLog(
      user,
      uuid,
    );
  }
}
