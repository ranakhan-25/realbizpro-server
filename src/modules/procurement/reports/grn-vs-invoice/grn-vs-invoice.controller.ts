import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryGrnVsInvoiceDto } from './dto/query-grn-vs-invoice.dto';
import { GrnVsInvoiceService } from './grn-vs-invoice.service';

@ApiTags('Procurement | Reports | GRN vs Invoice Report')
@ApiBearerAuth()
@Controller('procurement/reports/grn-vs-invoice')
export class GrnVsInvoiceController {
  constructor(private readonly service: GrnVsInvoiceService) {}
  @Get('dropdowns') @ApiOperation({ summary: 'Dropdown data for GRN vs Invoice report filters' }) dropdowns() { return this.service.dropdowns(); }
  @Get() @ApiOperation({ summary: 'Compare goods received with invoiced quantities and totals' }) report(@Query() query: QueryGrnVsInvoiceDto) { return this.service.report(query); }
}
