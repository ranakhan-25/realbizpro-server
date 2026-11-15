/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { BookingService } from './booking_createpage.service';
import { CreateBookingDto } from './dto/create-booking_createpage.dto';
import { UpdateBookingDto } from './dto/update-booking_createpage.dto';
import { QueryBookingDto } from './dto/query-booking_createpage.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Sales Management | Create")
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

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