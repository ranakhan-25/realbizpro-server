/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // âœ… Swagger Imports
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@ApiTags('Bookings - Transfer') // âœ… API Tag
@Controller('bookings/:uuid/transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @ApiOperation({ summary: 'Create or Update booking transfer (Upsert)' })
  @ApiResponse({ status: 201, description: 'Transfer saved successfully' })
  upsert(
    @Param('uuid') bookingUuid: string,
    @Body() dto: CreateTransferDto,
  ) {
    return this.transferService.upsert(bookingUuid, dto);
  }

  @Get(':transferUuid')
  @ApiOperation({ summary: 'Get booking transfer details' })
  @ApiResponse({ status: 200, description: 'Transfer retrieved successfully' })
  findOne(@Param('uuid') bookingUuid: string, @Param('transferUuid', ParseUUIDPipe) transferUuid: string) {
    return this.transferService.findOneByBooking(bookingUuid, transferUuid);
  }

  @Patch(':transferUuid')
  @ApiOperation({ summary: 'Partially update booking transfer' })
  update(
    @Param('uuid') bookingUuid: string,
    @Param('transferUuid', ParseUUIDPipe) transferUuid: string,
    @Body() dto: UpdateTransferDto,
  ) {
    return this.transferService.update(bookingUuid, transferUuid, dto);
  }

  @Delete(':transferUuid')
  @ApiOperation({ summary: 'Delete booking transfer' })
  remove(@Param('uuid') bookingUuid: string, @Param('transferUuid', ParseUUIDPipe) transferUuid: string) {
    return this.transferService.remove(bookingUuid, transferUuid);
  }
}
