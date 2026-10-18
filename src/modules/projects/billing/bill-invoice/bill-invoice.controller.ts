/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { BillInvoiceService } from './bill-invoice.service';
import { CreateBillInvoiceDto } from './dto/create-bill-invoice.dto';
import { UpdateBillInvoiceDto } from './dto/update-bill-invoice.dto';
import { QueryBillInvoiceDto } from './dto/query-bill-invoice.dto';

@ApiTags('Project | Billing | Bill Invoice')
@ApiBearerAuth()
@Controller('bill-invoice')
export class BillInvoiceController {
  constructor(
    private readonly billInvoiceService: BillInvoiceService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create new bill / invoice (with items)',
  })
  create(@Body() dto: CreateBillInvoiceDto) {
    return this.billInvoiceService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List bill / invoices (paginated)',
  })
  findAll(@Query() query: QueryBillInvoiceDto) {
    return this.billInvoiceService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get bill / invoice by UUID',
  })
  @ApiParam({ name: 'uuid' })
  findOne(@Param('uuid') uuid: string) {
    return this.billInvoiceService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update bill / invoice by UUID',
  })
  @ApiParam({ name: 'uuid' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateBillInvoiceDto,
  ) {
    return this.billInvoiceService.update(
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete bill / invoice by UUID',
  })
  @ApiParam({ name: 'uuid' })
  remove(@Param('uuid') uuid: string) {
    return this.billInvoiceService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore deleted bill / invoice',
  })
  @ApiParam({ name: 'uuid' })
  restore(@Param('uuid') uuid: string) {
    return this.billInvoiceService.restore(uuid);
  }
}
