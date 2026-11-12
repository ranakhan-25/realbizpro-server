/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { CreateOverviewDto } from './dto/create-overview.dto';
import { UpdateOverviewDto } from './dto/update-overview.dto';
import { OverviewService } from './overview.service';

@ApiTags('Bookings - Overview')
@Controller('bookings/:uuid/overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  // ⚠️ এই @Get() অবশ্যই @Get(':overviewUuid') এর আগে থাকতে হবে
  @Get()
  @ApiOperation({ summary: 'Get booking overview (first record)' })
  @ApiParam({
    name: 'uuid',
    description: 'Booking UUID, booking ID, or booking code',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Overview retrieved successfully' })
  findFirst(@Param('uuid') bookingUuid: string) {
    return this.overviewService.findFirstByBooking(bookingUuid);
  }

  @Post()
  @ApiOperation({ summary: 'Create or Update booking overview (Upsert)' })
  @ApiParam({ name: 'uuid', required: true })
  @ApiResponse({ status: 201, description: 'Overview saved successfully' })
  upsert(@Param('uuid') bookingUuid: string, @Body() dto: CreateOverviewDto) {
    return this.overviewService.upsert(bookingUuid, dto);
  }

  @Get(':overviewUuid')
  @ApiOperation({ summary: 'Get booking overview by overview UUID' })
  @ApiParam({ name: 'uuid', required: true })
  @ApiParam({ name: 'overviewUuid', required: true, format: 'uuid' })
  findOne(
    @Param('uuid') bookingUuid: string,
    @Param('overviewUuid', ParseUUIDPipe) overviewUuid: string,
  ) {
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
  remove(
    @Param('uuid') bookingUuid: string,
    @Param('overviewUuid', ParseUUIDPipe) overviewUuid: string,
  ) {
    return this.overviewService.remove(bookingUuid, overviewUuid);
  }
}