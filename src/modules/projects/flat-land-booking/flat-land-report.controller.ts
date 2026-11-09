import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Controller, Get, Query , UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryFlatLandBookingDto } from './dto/query-flat-land-booking.dto';
import { FlatLandBookingService } from './flat-land-booking.service';

@ApiTags('Flat Land | Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('flat-land-bookings/reports')
export class FlatLandReportController {
  constructor(private readonly bookingService: FlatLandBookingService) {}

  @Get('sales')
  @Permissions('sales_projects_flat_land_report')
  @ApiOperation({ summary: 'List flat/land sales report rows' })
  sales(
    @Query() query: QueryFlatLandBookingDto, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.findReport('sales', query, currentUser);
  }

  @Get('collection')
  @Permissions('collection_projects_flat_land_report')
  @ApiOperation({ summary: 'List flat/land collection report rows' })
  collection(
    @Query() query: QueryFlatLandBookingDto, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.findReport('collection', query, currentUser);
  }

  @Get('aging')
  @Permissions('aging_projects_flat_land_report')
  @ApiOperation({ summary: 'List outstanding flat/land bookings' })
  aging(
    @Query() query: QueryFlatLandBookingDto, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.findReport('aging', query, currentUser);
  }

  @Get('installments')
  @Permissions('installments_projects_flat_land_report')
  @ApiOperation({ summary: 'List flat/land installment balances' })
  installments(
    @Query() query: QueryFlatLandBookingDto, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.findReport('installments', query, currentUser);
  }

  @Get('plot-distribution')
  @Permissions('plot_distribution_projects_flat_land_report')
  @ApiOperation({ summary: 'List land plot distribution' })
  plotDistribution(
    @Query() query: QueryFlatLandBookingDto, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.findPlotDistribution(query, currentUser);
  }
}
