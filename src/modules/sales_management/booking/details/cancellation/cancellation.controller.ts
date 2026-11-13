/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // âœ… Swagger Imports
import { CancellationService } from './cancellation.service';
import { CreateCancellationDto } from './dto/create-cancellation.dto';
import { UpdateCancellationDto } from './dto/update-cancellation.dto';

@ApiTags('Bookings - Cancellation') // âœ… API Tag
@Controller('bookings/:uuid/cancellation')
export class CancellationController {
  constructor(private readonly cancellationService: CancellationService) {}

  @Post()
  @ApiOperation({ summary: 'Create or Update booking cancellation (Upsert)' })
  @ApiResponse({ status: 201, description: 'Cancellation saved successfully' })
  upsert(
    @Param('uuid') bookingUuid: string,
    @Body() dto: CreateCancellationDto,
  ) {
    return this.cancellationService.upsert(bookingUuid, dto);
  }

  @Get(':cancellationUuid')
  @ApiOperation({ summary: 'Get booking cancellation details' })
  @ApiResponse({ status: 200, description: 'Cancellation retrieved successfully' })
  findOne(@Param('uuid') bookingUuid: string, @Param('cancellationUuid', ParseUUIDPipe) cancellationUuid: string) {
    return this.cancellationService.findOneByBooking(bookingUuid, cancellationUuid);
  }

  @Patch(':cancellationUuid')
  @ApiOperation({ summary: 'Partially update booking cancellation' })
  update(
    @Param('uuid') bookingUuid: string,
    @Param('cancellationUuid', ParseUUIDPipe) cancellationUuid: string,
    @Body() dto: UpdateCancellationDto,
  ) {
    return this.cancellationService.update(bookingUuid, cancellationUuid, dto);
  }

  @Delete(':cancellationUuid')
  @ApiOperation({ summary: 'Delete booking cancellation' })
  remove(@Param('uuid') bookingUuid: string, @Param('cancellationUuid', ParseUUIDPipe) cancellationUuid: string) {
    return this.cancellationService.remove(bookingUuid, cancellationUuid);
  }
}
