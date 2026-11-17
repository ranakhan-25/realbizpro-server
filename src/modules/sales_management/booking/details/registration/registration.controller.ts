/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // âœ… Swagger Imports
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';

@ApiTags('Bookings - Registration') // âœ… API Tag
@Controller('bookings/:uuid/registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @ApiOperation({ summary: 'Create or Update booking registration (Upsert)' })
  @ApiResponse({ status: 201, description: 'Registration saved successfully' })
  upsert(
    @Param('uuid') bookingUuid: string,
    @Body() dto: CreateRegistrationDto,
  ) {
    return this.registrationService.upsert(bookingUuid, dto);
  }

  @Get(':registrationUuid')
  @ApiOperation({ summary: 'Get booking registration details' })
  @ApiResponse({ status: 200, description: 'Registration retrieved successfully' })
  findOne(@Param('uuid') bookingUuid: string, @Param('registrationUuid', ParseUUIDPipe) registrationUuid: string) {
    return this.registrationService.findOneByBooking(bookingUuid, registrationUuid);
  }

  @Patch(':registrationUuid')
  @ApiOperation({ summary: 'Partially update booking registration' })
  update(
    @Param('uuid') bookingUuid: string,
    @Param('registrationUuid', ParseUUIDPipe) registrationUuid: string,
    @Body() dto: UpdateRegistrationDto,
  ) {
    return this.registrationService.update(bookingUuid, registrationUuid, dto);
  }

  @Delete(':registrationUuid')
  @ApiOperation({ summary: 'Delete booking registration' })
  remove(@Param('uuid') bookingUuid: string, @Param('registrationUuid', ParseUUIDPipe) registrationUuid: string) {
    return this.registrationService.remove(bookingUuid, registrationUuid);
  }
}
