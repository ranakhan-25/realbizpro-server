/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // âœ… Swagger Imports
import { CommissionService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';

@ApiTags('Bookings - Commission') // âœ… API Tag
@Controller('bookings/:bookingId/commission')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Post()
  @ApiOperation({ summary: 'Create or Update booking commission (Upsert)' })
  @ApiResponse({ status: 201, description: 'Commission saved successfully' })
  upsert(
    @Param('bookingId') bookingId: string,
    @Body() dto: CreateCommissionDto,
  ) {
    return this.commissionService.upsert(bookingId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get booking commission details' })
  @ApiResponse({ status: 200, description: 'Commission retrieved successfully' })
  findOne(@Param('bookingId') bookingId: string) {
    return this.commissionService.findOneByBooking(bookingId);
  }

  @Patch()
  @ApiOperation({ summary: 'Partially update booking commission' })
  update(
    @Param('bookingId') bookingId: string,
    @Body() dto: UpdateCommissionDto,
  ) {
    return this.commissionService.update(bookingId, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete booking commission' })
  remove(@Param('bookingId') bookingId: string) {
    return this.commissionService.remove(bookingId);
  }
}
