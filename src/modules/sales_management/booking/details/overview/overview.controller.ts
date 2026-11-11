/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // âœ… Swagger Imports
import { OverviewService } from './overview.service';
import { CreateOverviewDto } from './dto/create-overview.dto';
import { UpdateOverviewDto } from './dto/update-overview.dto';

@ApiTags('Bookings - Overview') // âœ… API Tag
@Controller('bookings/:uuid/overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create or Update booking overview (Upsert)' })
  @ApiResponse({ status: 201, description: 'Overview saved successfully' })
  upsert(
    @Param('uuid') bookingUuid: string,
    @Body() dto: CreateOverviewDto,
  ) {
    return this.overviewService.upsert(bookingUuid, dto);
  }

  @Get(':overviewUuid')
  @ApiOperation({ summary: 'Get booking overview details' })
  @ApiResponse({ status: 200, description: 'Overview retrieved successfully' })
  findOne(@Param('uuid') bookingUuid: string, @Param('overviewUuid', ParseUUIDPipe) overviewUuid: string) {
    return this.overviewService.findOneByBooking(bookingUuid, overviewUuid);
  }

  @Patch(':overviewUuid')
  @ApiOperation({ summary: 'Partially update booking overview' })
  update(
    @Param('uuid') bookingUuid: string,
    @Param('overviewUuid', ParseUUIDPipe) overviewUuid: string,
    @Body() dto: UpdateOverviewDto,
  ) {
    return this.overviewService.update(bookingUuid, overviewUuid, dto);
  }

  @Delete(':overviewUuid')
  @ApiOperation({ summary: 'Delete booking overview' })
  remove(@Param('uuid') bookingUuid: string, @Param('overviewUuid', ParseUUIDPipe) overviewUuid: string) {
    return this.overviewService.remove(bookingUuid, overviewUuid);
  }
}
