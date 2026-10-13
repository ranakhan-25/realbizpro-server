import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CrInstallmentService } from './cr-installment.service';
import { CreateCrPaymentDto, WaivePenaltyDto } from './dto/create-cr-payment.dto';

@ApiTags('Credit Realization - Installments & Payments')
@Controller('credit-realization/installments')
export class CrInstallmentController {
  constructor(private readonly service: CrInstallmentService) {}

  @Get('overdue')
  @ApiOperation({
    summary: 'Get all overdue installments with dynamic penalty & delay day calculation',
  })
  async getOverdueInstallments() {
    return this.service.getOverdueInstallments();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get installment plan details and payment vouchers by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Post(':uuid/payments')
  @ApiOperation({ summary: 'Record an installment payment voucher and rebalance dues' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: CreateCrPaymentDto })
  async recordPayment(
    @Param('uuid') uuid: string,
    @Body() dto: CreateCrPaymentDto,
  ) {
    return this.service.recordPayment(uuid, dto);
  }

  @Post(':uuid/waive-penalty')
  @ApiOperation({ summary: 'Waive or reduce delay penalty for an installment' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: WaivePenaltyDto })
  async waivePenalty(
    @Param('uuid') uuid: string,
    @Body() dto: WaivePenaltyDto,
  ) {
    return this.service.waivePenalty(uuid, dto);
  }
}
