/* eslint-disable prettier/prettier */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { QueryFlatLandBookingDto } from './dto/query-flat-land-booking.dto';
import { FlatLandBookingService } from './flat-land-booking.service';

@ApiTags('Flat Land | Reports')
@ApiBearerAuth()
@Controller('flat-land-bookings/reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FlatLandReportController {
  constructor(private readonly bookingService: FlatLandBookingService) {}

  @Get('sales')
  @Permissions('view_flat_land_booking_reports')
  @ApiOperation({ summary: 'List flat/land sales report rows' })
  sales(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findReport('sales', query);
  }

  @Get('collection')
  @Permissions('view_flat_land_booking_reports')
  @ApiOperation({ summary: 'List flat/land collection report rows' })
  collection(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findReport('collection', query);
  }

  @Get('aging')
  @Permissions('view_flat_land_booking_reports')
  @ApiOperation({ summary: 'List outstanding flat/land bookings' })
  aging(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findReport('aging', query);
  }

  @Get('installments')
  @Permissions('view_flat_land_booking_reports')
  @ApiOperation({ summary: 'List flat/land installment balances' })
  installments(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findReport('installments', query);
  }

  @Get('plot-distribution')
  @Permissions('view_flat_land_booking_reports')
  @ApiOperation({ summary: 'List land plot distribution' })
  plotDistribution(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findPlotDistribution(query);
  }
}
