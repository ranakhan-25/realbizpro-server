import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  CurrentUser,
  CurrentUserId,
} from 'src/common/decorators/auth.decorators';
import { CustomerServiceBookingsService } from './customer-service-bookings.service';
import { QueryPropertiesBookingsDto } from './dto/query-properties-bookings.dto';
import { UpdateHandoverStatusDto } from './dto/update-handover-status.dto';

@ApiTags(
  'Customer Service | Bookings & Property Portfolio',
)
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  CustomerServiceTenantGuard,
)
@Controller(
  'customer-service/properties-bookings',
)
export class CustomerServiceBookingsController {
  constructor(
    private readonly bookingsService: CustomerServiceBookingsService,
  ) {}

  // 1. Static Route: KPI Overview Stats (Declared BEFORE /:uuid)
  @Get('stats')
  @ApiOperation({
    summary:
      'Get Bookings & Property Portfolio KPI metrics (single aggregation query)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Portfolio KPI statistics calculated successfully',
  })
  getStats(
    @Query('project_id') projectId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.bookingsService.getStats(
      projectId,
      user,
    );
  }

  // 2. Static Route: Dropdown Metadata (Declared BEFORE /:uuid)
  @Get('dropdown/meta')
  @ApiOperation({
    summary:
      'Get dropdown metadata (projects, handover statuses, unit types)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Dynamic dropdown metadata retrieved successfully',
  })
  getDropdownMeta(@CurrentUser() user?: any) {
    return this.bookingsService.getDropdownMeta(
      user,
    );
  }

  // 3. Collection Route: Paginated Portfolio List with Search, Filters & Tab Counts
  @Get()
  @ApiOperation({
    summary:
      'List customer property bookings with search, tab counts, and pagination',
  })
  @ApiResponse({
    status: 200,
    description:
      'Paginated bookings list with tab counts retrieved successfully',
  })
  findBookings(
    @Query() query: QueryPropertiesBookingsDto,
    @CurrentUser() user?: any,
  ) {
    return this.bookingsService.findBookings(
      query,
      user,
    );
  }

  // 4. Param Route: Demand Letter Preview Quick Data
  @Get(':uuid/demand-letter-preview')
  @ApiOperation({
    summary:
      'Preview milestone demand letter details, bank instructions, and reference',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Booking UUID',
    type: 'string',
  })
  getDemandLetterPreview(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.bookingsService.getDemandLetterPreview(
      uuid,
      user,
    );
  }

  // 5. Param Route: Booking 360 Detailed Profile
  @Get(':uuid')
  @ApiOperation({
    summary:
      'Get complete Booking 360 view (unit specs, customer snippet, cost breakdown, snag summary)',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Booking UUID',
    type: 'string',
  })
  getBooking360(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.bookingsService.getBooking360(
      uuid,
      user,
    );
  }

  // 6. Action Route: Handover Status Transition (State Machine + RBAC)
  @Patch(':uuid/handover-status')
  @UseGuards(RolesGuard)
  @Roles(
    'super-admin',
    'org-admin',
    'admin',
    'customer-service',
    'customer-service-manager',
    'cs-agent',
  )
  @ApiOperation({
    summary:
      'Transition property handover lifecycle status (Under Construction -> Ready for Snagging -> DLP Active -> Handed Over)',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Booking UUID',
    type: 'string',
  })
  updateHandoverStatus(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateHandoverStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.updateHandoverStatus(
      uuid,
      dto,
      user,
    );
  }
}
