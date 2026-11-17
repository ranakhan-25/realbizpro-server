import { Injectable } from '@nestjs/common';
import { CreateInvoiceItemDto } from './dto/create-invoice-item.dto';
import { UpdateInvoiceItemDto } from './dto/update-invoice-item.dto';

@Injectable()
export class InvoiceItemService {
  create(createInvoiceItemDto: CreateInvoiceItemDto, userId?: number, currentUser?: any) {
    return 'This action adds a new invoiceItem';
  }

  findAll(query?: any, currentUser?: any) {
    return 'This action returns all invoiceItem';
  }

  findOne(id: any, currentUser?: any) {
    return `This action returns a #${id} invoiceItem`;
  }

  update(id: any, updateInvoiceItemDto: UpdateInvoiceItemDto, userId?: number, currentUser?: any) {
    return `This action updates a #${id} invoiceItem`;
  }

  remove(id: any, userId?: number, currentUser?: any) {
    return `This action removes a #${id} invoiceItem`;
  }
}
