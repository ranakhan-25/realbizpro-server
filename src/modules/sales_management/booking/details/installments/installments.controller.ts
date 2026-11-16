/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Swagger Imports
import { InstallmentsService } from './installments.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';
import { QueryInstallmentDto } from './dto/query-installment.dto';

@ApiTags('Bookings - Installments') // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ API Tag
@Controller('bookings/:uuid/installments')
export class InstallmentsController {
  constructor(private readonly installmentsService: InstallmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new installment for a booking' })
  @ApiResponse({ status: 201, description: 'Installment created successfully' })
  create(
    @Param('uuid') bookingUuid: string,
    @Body() dto: CreateInstallmentDto,
  ) {
    return this.installmentsService.create(bookingUuid, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all installments for a booking (Paginated)' })
  findAll(
    @Param('uuid') bookingUuid: string,
    @Query() query: QueryInstallmentDto,
  ) {
    return this.installmentsService.findAllByBooking(bookingUuid, query);
  }

  @Get(':installmentUuid')
  @ApiOperation({ summary: 'Get a specific installment by UUID' })
  findOne(@Param('uuid') bookingUuid: string, @Param('installmentUuid', ParseUUIDPipe) installmentUuid: string) {
    return this.installmentsService.findOne(installmentUuid, bookingUuid);
  }

  @Patch(':installmentUuid')
  @ApiOperation({ summary: 'Partially update an installment' })
  async updateWithPatch(
    @Param('uuid') bookingUuid: string,
    @Param('installmentUuid', ParseUUIDPipe) installmentUuid: string,
    @Body() dto: UpdateInstallmentDto,
  ) {
    await this.installmentsService.findOne(installmentUuid, bookingUuid);
    return this.installmentsService.update(installmentUuid, dto);
  }

  @Put(':installmentUuid')
  @ApiOperation({ summary: 'Fully update an installment' })
  async updateWithPut(
    @Param('uuid') bookingUuid: string,
    @Param('installmentUuid', ParseUUIDPipe) installmentUuid: string,
    @Body() dto: UpdateInstallmentDto,
  ) {
    await this.installmentsService.findOne(installmentUuid, bookingUuid);
    return this.installmentsService.update(installmentUuid, dto);
  }

  @Delete(':installmentUuid')
  @ApiOperation({ summary: 'Soft delete an installment' })
  async remove(@Param('uuid') bookingUuid: string, @Param('installmentUuid', ParseUUIDPipe) installmentUuid: string) {
    await this.installmentsService.findOne(installmentUuid, bookingUuid);
    return this.installmentsService.remove(installmentUuid);
  }
}
