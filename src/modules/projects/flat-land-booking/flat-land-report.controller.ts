/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryFlatLandBookingDto } from './dto/query-flat-land-booking.dto';
import { FlatLandBookingService } from './flat-land-booking.service';

@ApiTags('Flat Land | Reports')
@ApiBearerAuth()
@Controller('flat-land-bookings/reports')
export class FlatLandReportController {
  constructor(private readonly bookingService: FlatLandBookingService) {}

  @Get('sales')
  @ApiOperation({ summary: 'List flat/land sales report rows' })
  sales(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findReport('sales', query);
  }

  @Get('collection')
  @ApiOperation({ summary: 'List flat/land collection report rows' })
  collection(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findReport('collection', query);
  }

  @Get('aging')
  @ApiOperation({ summary: 'List outstanding flat/land bookings' })
  aging(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findReport('aging', query);
  }

  @Get('installments')
  @ApiOperation({ summary: 'List flat/land installment balances' })
  installments(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findReport('installments', query);
  }

  @Get('plot-distribution')
  @ApiOperation({ summary: 'List land plot distribution' })
  plotDistribution(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findPlotDistribution(query);
  }
}
