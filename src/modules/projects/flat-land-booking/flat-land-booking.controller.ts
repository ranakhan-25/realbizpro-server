import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Put, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFlatLandBookingDto } from './dto/create-flat-land-booking.dto';
import { QueryFlatLandBookingDto } from './dto/query-flat-land-booking.dto';
import { UpdateFlatLandBookingDto } from './dto/update-flat-land-booking.dto';
import { FlatLandBookingService } from './flat-land-booking.service';

type AuthenticatedRequest = Request & { user?: { id?: number } };

@ApiTags('CRM | Property | Booking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('flat-land-bookings')
export class FlatLandBookingController {
  constructor(private readonly bookingService: FlatLandBookingService) {}

  @Post()
  @Permissions('create_projects_flat_land_booking')
  @ApiOperation({ summary: 'Create a flat/land booking' })
  create(
    @Body() dto: CreateFlatLandBookingDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_flat_land_booking')
  @ApiOperation({ summary: 'List flat/land bookings' })
  findAll(
    @Query() query: QueryFlatLandBookingDto, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.findAll(query, currentUser);
  }

  @Get('dropdowns')
  @Permissions('read_projects_flat_land_booking')
  @ApiOperation({ summary: 'Get project, available property, and existing booking status dropdown data' })
  dropdowns(
    @CurrentUser() currentUser: any
  ) {
    return this.bookingService.dropdowns();
  }

  @Get(':uuid')
  @Permissions('read_projects_flat_land_booking')
  @ApiOperation({ summary: 'Get a flat/land booking by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.findOne(uuid, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_projects_flat_land_booking')
  @ApiOperation({ summary: 'Update a flat/land booking (PUT)' })
  updatePut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandBookingDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.update(uuid, dto, userId, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_flat_land_booking')
  @ApiOperation({ summary: 'Update a flat/land booking' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateFlatLandBookingDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_flat_land_booking')
  @ApiOperation({ summary: 'Cancel a flat/land booking' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_flat_land_booking')
  @ApiOperation({ summary: 'Restore a deleted booking and reserve its property when available' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.bookingService.restore(uuid, userId, currentUser);
  }
}
