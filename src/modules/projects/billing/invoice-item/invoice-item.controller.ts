import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { InvoiceItemService } from './invoice-item.service';
import { CreateInvoiceItemDto } from './dto/create-invoice-item.dto';
import { UpdateInvoiceItemDto } from './dto/update-invoice-item.dto';

@Controller('invoice-item')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvoiceItemController {
  constructor(
    private readonly invoiceItemService: InvoiceItemService,
  ) {}

  @Post()
  @Permissions('create_invoice_item')
  create(
    @Body()
    createInvoiceItemDto: CreateInvoiceItemDto,
  ) {
    return this.invoiceItemService.create(
      createInvoiceItemDto,
    );
  }

  @Get()
  @Permissions('view_invoice_items')
  findAll() {
    return this.invoiceItemService.findAll();
  }

  @Get(':id')
  @Permissions('view_invoice_item')
  findOne(@Param('id') id: string) {
    return this.invoiceItemService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('update_invoice_item')
  update(
    @Param('id') id: string,
    @Body()
    updateInvoiceItemDto: UpdateInvoiceItemDto,
  ) {
    return this.invoiceItemService.update(
      +id,
      updateInvoiceItemDto,
    );
  }

  @Delete(':id')
  @Permissions('delete_invoice_item')
  remove(@Param('id') id: string) {
    return this.invoiceItemService.remove(+id);
  }
}
