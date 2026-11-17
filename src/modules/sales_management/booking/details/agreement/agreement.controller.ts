/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // ✅ Swagger Imports
import { AgreementService } from './agreement.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';

@ApiTags('Bookings - Agreement') // ✅ API Tag
@Controller('bookings/:uuid/agreement')
export class AgreementController {
  constructor(private readonly agreementService: AgreementService) {}

  @Post()
  @ApiOperation({ summary: 'Create or Update booking agreement (Upsert)' })
  @ApiResponse({ status: 201, description: 'Agreement saved successfully' })
  upsert(
    @Param('uuid') bookingUuid: string,
    @Body() dto: CreateAgreementDto,
  ) {
    return this.agreementService.upsert(bookingUuid, dto);
  }

  @Get(':agreementUuid')
  @ApiOperation({ summary: 'Get booking agreement details' })
  @ApiResponse({ status: 200, description: 'Agreement retrieved successfully' })
  findOne(@Param('uuid') bookingUuid: string, @Param('agreementUuid', ParseUUIDPipe) agreementUuid: string) {
    return this.agreementService.findOneByBooking(bookingUuid, agreementUuid);
  }

  @Patch(':agreementUuid')
  @ApiOperation({ summary: 'Partially update booking agreement' })
  update(
    @Param('uuid') bookingUuid: string,
    @Param('agreementUuid', ParseUUIDPipe) agreementUuid: string,
    @Body() dto: UpdateAgreementDto,
  ) {
    return this.agreementService.update(bookingUuid, agreementUuid, dto);
  }

  @Delete(':agreementUuid')
  @ApiOperation({ summary: 'Delete booking agreement' })
  remove(@Param('uuid') bookingUuid: string, @Param('agreementUuid', ParseUUIDPipe) agreementUuid: string) {
    return this.agreementService.remove(bookingUuid, agreementUuid);
  }
}
