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
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFlatLandBookingDto } from './dto/create-flat-land-booking.dto';
import { QueryFlatLandBookingDto } from './dto/query-flat-land-booking.dto';
import { UpdateFlatLandBookingDto } from './dto/update-flat-land-booking.dto';
import { FlatLandBookingService } from './flat-land-booking.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('CRM | Property | Booking')
@ApiBearerAuth()
@Controller('flat-land-bookings')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FlatLandBookingController {
  constructor(private readonly bookingService: FlatLandBookingService) {}

  @Post()
  @Permissions('create_flat_land_booking')
  @ApiOperation({ summary: 'Create a flat/land booking' })
  create(
    @Body() dto: CreateFlatLandBookingDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.bookingService.create(dto, request.user?.id);
  }

  @Get()
  @Permissions('view_flat_land_bookings')
  @ApiOperation({ summary: 'List flat/land bookings' })
  findAll(@Query() query: QueryFlatLandBookingDto) {
    return this.bookingService.findAll(query);
  }

  @Get('dropdowns')
  @ApiOperation({ summary: 'Get project, available property, and existing booking status dropdown data' })
  dropdowns() { return this.bookingService.dropdowns(); }

  @Get(':uuid')
  @Permissions('view_flat_land_booking')
  @ApiOperation({ summary: 'Get a flat/land booking by UUID' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.bookingService.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('update_flat_land_booking')
  @ApiOperation({ summary: 'Update a flat/land booking (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandBookingDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.update(uuid, dto, request);
  }

  @Patch(':uuid')
  @Permissions('update_flat_land_booking')
  @ApiOperation({ summary: 'Update a flat/land booking' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandBookingDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.bookingService.update(uuid, dto, request.user?.id);
  }

  @Delete(':uuid')
  @Permissions('delete_flat_land_booking')
  @ApiOperation({ summary: 'Cancel a flat/land booking' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.bookingService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore a deleted booking and reserve its property when available' })
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.bookingService.restore(uuid); }
}
