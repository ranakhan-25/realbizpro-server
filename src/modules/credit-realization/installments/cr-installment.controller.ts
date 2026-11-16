import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CrInstallmentService } from './cr-installment.service';
import { CreateCrPaymentDto, WaivePenaltyDto } from './dto/create-cr-payment.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Credit Realization - Installments & Payments')
@ApiBearerAuth()
@Controller('credit-realization/installments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrInstallmentController {
  constructor(private readonly service: CrInstallmentService) {}

  @Get('overdue')
  @Permissions('credit-realization:read')
  @ApiOperation({
    summary: 'Get all overdue installments with dynamic penalty & delay day calculation',
  })
  async getOverdueInstallments() {
    return this.service.getOverdueInstallments();
  }

  @Get(':uuid')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get installment plan details and payment vouchers by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Post(':uuid/payments')
  @Permissions('credit-realization:write')
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
  @Permissions('credit-realization:write')
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
