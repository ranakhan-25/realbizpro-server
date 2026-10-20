/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFlatLandBookingDto } from './dto/create-flat-land-booking.dto';
import { QueryFlatLandBookingDto } from './dto/query-flat-land-booking.dto';
import { UpdateFlatLandBookingDto } from './dto/update-flat-land-booking.dto';
import { FlatLandBookingService } from './flat-land-booking.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('Project | Flat/Land Bookings')
@ApiBearerAuth()
@Controller('flat-land-bookings')
export class FlatLandBookingController {
  constructor(private readonly bookingService: FlatLandBookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a flat/land booking' })
  create(
    @Body() dto: CreateFlatLandBookingDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.bookingService.create(dto, request.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List flat/land bookings' })
  findAll(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a flat/land booking by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.bookingService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a flat/land booking (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandBookingDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.update(uuid, dto, request);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a flat/land booking' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandBookingDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.bookingService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Cancel a flat/land booking' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.bookingService.remove(uuid);
  }
}
