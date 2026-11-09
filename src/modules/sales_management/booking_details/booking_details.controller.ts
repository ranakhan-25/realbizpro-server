/* eslint-disable prettier/prettier */

import { Controller, Get, Patch, Put, Param, Body, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { BookingService } from './booking_details.service';
import { UpdateBookingDto } from './dto/update-booking_detail.dto';
import { QueryBookingDto } from './dto/query-booking_detail.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Sales Management | Details")
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  findAll(@Query() query: QueryBookingDto) {
    return this.bookingService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.bookingService.findOne(uuid);
  }

  @Patch(':uuid')
  updateWithPatch(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.update(uuid, dto);
  }

  @Put(':uuid')
  updateWithPut(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.bookingService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.bookingService.restore(uuid);
  }
}