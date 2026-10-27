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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

import { BillInvoiceService } from './bill-invoice.service';
import { CreateBillInvoiceDto } from './dto/create-bill-invoice.dto';
import { UpdateBillInvoiceDto } from './dto/update-bill-invoice.dto';
import { QueryBillInvoiceDto } from './dto/query-bill-invoice.dto';

@ApiTags('Project | Billing | Bill Invoice')
@ApiBearerAuth()
@Controller('bill-invoice')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BillInvoiceController {
  constructor(
    private readonly billInvoiceService: BillInvoiceService,
  ) {}

  @Post()
  @Permissions('create_bill_invoice')
  @ApiOperation({
    summary:
      'Create new bill / invoice (with items)',
  })
  create(@Body() dto: CreateBillInvoiceDto) {
    return this.billInvoiceService.create(dto);
  }

  @Get()
  @Permissions('view_bill_invoices')
  @ApiOperation({
    summary: 'List bill / invoices (paginated)',
  })
  findAll(@Query() query: QueryBillInvoiceDto) {
    return this.billInvoiceService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_bill_invoice')
  @ApiOperation({
    summary: 'Get bill / invoice by UUID',
  })
  @ApiParam({ name: 'uuid' })
  findOne(@Param('uuid') uuid: string) {
    return this.billInvoiceService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_bill_invoice')
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
  @Permissions('delete_bill_invoice')
  @ApiOperation({
    summary: 'Delete bill / invoice by UUID',
  })
  @ApiParam({ name: 'uuid' })
  remove(@Param('uuid') uuid: string) {
    return this.billInvoiceService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_bill_invoice')
  @ApiOperation({
    summary: 'Restore deleted bill / invoice',
  })
  @ApiParam({ name: 'uuid' })
  restore(@Param('uuid') uuid: string) {
    return this.billInvoiceService.restore(uuid);
  }
}
