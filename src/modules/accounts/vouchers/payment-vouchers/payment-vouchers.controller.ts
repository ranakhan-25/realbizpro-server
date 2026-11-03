import { 
  Controller, Post, Body, Get, Query, 
  Param, Delete, ParseUUIDPipe
} from '@nestjs/common';
import { PaymentVouchersService } from './payment-vouchers.service';
import { CreatePaymentVoucherDto } from './dto/create-payment-voucher.dto';
import { GetPaymentVouchersQueryDto } from './dto/query-payment-voucher.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
@ApiTags("Accounts| vouchers| peyement)vouchers")
@Controller('payment-vouchers')
export class PaymentVouchersController {
  constructor(private readonly paymentVouchersService: PaymentVouchersService) {}

  @Post()
  create(@Body() dto: CreatePaymentVoucherDto) {
    return this.paymentVouchersService.create(dto);
  }

  @Get()
  findAll(@Query() query: GetPaymentVouchersQueryDto) {
    return this.paymentVouchersService.findAll(query);
  }

  @Get(':uuid')
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.paymentVouchersService.findOne(uuid);
  }

  @Delete(':uuid')
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.paymentVouchersService.remove(uuid);
  }
}