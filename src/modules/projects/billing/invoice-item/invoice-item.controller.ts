import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InvoiceItemService } from './invoice-item.service';
import { CreateInvoiceItemDto } from './dto/create-invoice-item.dto';
import { UpdateInvoiceItemDto } from './dto/update-invoice-item.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('invoice-item')
export class InvoiceItemController {
  constructor(
    private readonly invoiceItemService: InvoiceItemService,
  ) {}

  @Post()
  @Permissions('create_projects_invoice_item')
  create(
    @Body()
    createInvoiceItemDto: CreateInvoiceItemDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.invoiceItemService.create(createInvoiceItemDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_invoice_item')
  findAll(
    @CurrentUser() currentUser: any
  ) {
    return this.invoiceItemService.findAll(currentUser);
  }

  @Get(':id')
  @Permissions('read_projects_invoice_item')
  findOne(
    @Param('id') id: string, @CurrentUser() currentUser: any
  ) {
    return this.invoiceItemService.findOne(+id, currentUser);
  }

  @Patch(':id')
  @Permissions('update_projects_invoice_item')
  update(
    @Param('id') id: string,
    @Body()
    updateInvoiceItemDto: UpdateInvoiceItemDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.invoiceItemService.update(+id,
      updateInvoiceItemDto, userId, currentUser);
  }

  @Delete(':id')
  @Permissions('delete_projects_invoice_item')
  remove(
    @Param('id') id: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.invoiceItemService.remove(+id, userId, currentUser);
  }
}
