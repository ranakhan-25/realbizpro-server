import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  
} from '@nestjs/swagger';
import { CencellationviewService } from './cencellationview.service';
import {
  CreateCancellationDto,
} from './dto/create-cencellationview.dto';
import { QueryCancellationDto } from './dto/query-cencellationview.dto';
import { UpdateCancellationDto } from './dto/update-cencellationview.dto';
import { RestoreCancellationDto } from './dto/restore-cencellationview.dto';
import { Cancellation } from '../../../database/models/sales_management/sm_cencellationview.model';
import { BookingCreate as Booking } from '../../../database/models/sales_management/sm_booking_create_model';

ApiTags("CencellingView")
@Controller('cancellations')
export class CancellationsController {
  constructor(private readonly service: CencellationviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a cancellation for an active booking' })
  @ApiResponse({ status: 201, type: Cancellation })
  @ApiResponse({ status: 400, description: 'Invalid refund/penalty or not acknowledged' })
  @ApiResponse({ status: 409, description: 'Booking already cancelled' })
  create(@Body() dto: CreateCancellationDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List cancellations (search/filter/pagination)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['Pending', 'Approved', 'Rejected', 'Completed'] })
  @ApiQuery({ name: 'reason', required: false })
  @ApiQuery({ name: 'bookingId', required: false, type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query: QueryCancellationDto) {
    return this.service.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Cancellation aggregate stats' })
  getStats() {
    return this.service.getStats();
  }

  @Get('active-bookings')
  @ApiOperation({
    summary: 'List active bookings available for cancellation (form picker)',
  })
  @ApiResponse({ status: 200, type: [Booking] })
  @ApiQuery({ name: 'search', required: false })
  findActiveBookings(@Query('search') search?: string) {
    return this.service.findActiveBookings(search);
  }

  @Get('trash')
  @ApiOperation({ summary: 'List soft-deleted cancellations' })
  findDeleted() {
    return this.service.findDeleted();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get cancellation by UUID (includes booking)' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update cancellation' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateCancellationDto,
  ) {
    return this.service.update(uuid, dto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete cancellation' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.remove(uuid);
  }

  @Delete(':uuid/force')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete cancellation' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid' })
  forceRemove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.forceRemove(uuid);
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a single soft-deleted cancellation' })
  restore(@Body() dto: RestoreCancellationDto) {
    return this.service.restore(dto);
  }

  @Post('restore-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore all soft-deleted cancellations' })
  restoreAll() {
    return this.service.restoreAll();
  }
}
