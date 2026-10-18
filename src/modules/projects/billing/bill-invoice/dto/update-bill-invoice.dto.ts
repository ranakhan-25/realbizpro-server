/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateBillInvoiceDto } from './create-bill-invoice.dto';

export class UpdateBillInvoiceDto extends PartialType(
  CreateBillInvoiceDto,
) {}
