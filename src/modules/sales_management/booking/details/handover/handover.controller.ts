/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // âœ… Swagger Imports
import { HandoverService } from './handover.service';
import { CreateHandoverDto } from './dto/create-handover.dto';
import { UpdateHandoverDto } from './dto/update-handover.dto';

@ApiTags('Bookings - Handover') // âœ… API Tag
@Controller('bookings/:uuid/handover')
export class HandoverController {
  constructor(private readonly handoverService: HandoverService) {}

  @Post()
  @ApiOperation({ summary: 'Create or Update booking handover (Upsert)' })
  @ApiResponse({ status: 201, description: 'Handover saved successfully' })
  upsert(
    @Param('uuid') bookingUuid: string,
    @Body() dto: CreateHandoverDto,
  ) {
    return this.handoverService.upsert(bookingUuid, dto);
  }

  @Get(':handoverUuid')
  @ApiOperation({ summary: 'Get booking handover details' })
  @ApiResponse({ status: 200, description: 'Handover retrieved successfully' })
  findOne(@Param('uuid') bookingUuid: string, @Param('handoverUuid', ParseUUIDPipe) handoverUuid: string) {
    return this.handoverService.findOneByBooking(bookingUuid, handoverUuid);
  }

  @Patch(':handoverUuid')
  @ApiOperation({ summary: 'Partially update booking handover' })
  update(
    @Param('uuid') bookingUuid: string,
    @Param('handoverUuid', ParseUUIDPipe) handoverUuid: string,
    @Body() dto: UpdateHandoverDto,
  ) {
    return this.handoverService.update(bookingUuid, handoverUuid, dto);
  }

  @Delete(':handoverUuid')
  @ApiOperation({ summary: 'Delete booking handover' })
  remove(@Param('uuid') bookingUuid: string, @Param('handoverUuid', ParseUUIDPipe) handoverUuid: string) {
    return this.handoverService.remove(bookingUuid, handoverUuid);
  }
}
