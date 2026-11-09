import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';


import { BillInvoiceService } from './bill-invoice.service';
import { CreateBillInvoiceDto } from './dto/create-bill-invoice.dto';
import { UpdateBillInvoiceDto } from './dto/update-bill-invoice.dto';
import { QueryBillInvoiceDto } from './dto/query-bill-invoice.dto';

@ApiTags('Project | Billing | Bill Invoice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bill-invoice')
export class BillInvoiceController {
  constructor(
    private readonly billInvoiceService: BillInvoiceService,
  ) {}

  @Post()
  @Permissions('create_projects_bill_invoice')
  @ApiOperation({
    summary:
      'Create new bill / invoice (with items)',
  })
  create(
    @Body() dto: CreateBillInvoiceDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.billInvoiceService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_bill_invoice')
  @ApiOperation({
    summary: 'List bill / invoices (paginated)',
  })
  findAll(
    @Query() query: QueryBillInvoiceDto, @CurrentUser() currentUser: any
  ) {
    return this.billInvoiceService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_bill_invoice')
  @ApiOperation({
    summary: 'Get bill / invoice by UUID',
  })
  @ApiParam({ name: 'uuid' })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.billInvoiceService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_bill_invoice')
  @ApiOperation({
    summary: 'Update bill / invoice by UUID',
  })
  @ApiParam({ name: 'uuid' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateBillInvoiceDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.billInvoiceService.update(uuid,
      dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_bill_invoice')
  @ApiOperation({
    summary: 'Delete bill / invoice by UUID',
  })
  @ApiParam({ name: 'uuid' })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.billInvoiceService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_bill_invoice')
  @ApiOperation({
    summary: 'Restore deleted bill / invoice',
  })
  @ApiParam({ name: 'uuid' })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.billInvoiceService.restore(uuid, userId, currentUser);
  }
}
