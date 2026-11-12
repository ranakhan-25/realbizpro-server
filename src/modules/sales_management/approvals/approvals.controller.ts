/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApprovalService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@ApiTags('Bookings - Approvals')
@Controller('bookings/:uuid/approval')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Post()
  @ApiOperation({ summary: 'Create or Update booking approval (Upsert)' })
  @ApiParam({ name: 'uuid', description: 'Booking UUID or Booking Code' })
  upsert(@Param('uuid') bookingUuid: string, @Body() dto: CreateApprovalDto) {
    return this.approvalService.upsert(bookingUuid, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get booking approval details' })
  findFirst(@Param('uuid') bookingUuid: string) {
    return this.approvalService.findByBooking(bookingUuid);
  }

  @Patch(':approvalUuid')
  @ApiOperation({ summary: 'Update booking approval' })
  update(
    @Param('uuid') bookingUuid: string,
    @Param('approvalUuid', ParseUUIDPipe) approvalUuid: string,
    @Body() dto: UpdateApprovalDto,
  ) {
    return this.approvalService.update(bookingUuid, approvalUuid, dto);
  }

  @Delete(':approvalUuid')
  @ApiOperation({ summary: 'Delete booking approval' })
  remove(
    @Param('uuid') bookingUuid: string,
    @Param('approvalUuid', ParseUUIDPipe) approvalUuid: string,
  ) {
    return this.approvalService.remove(bookingUuid, approvalUuid);
  }
}
