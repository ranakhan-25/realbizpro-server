import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CrInstallmentService } from './cr-installment.service';
import { CreateCrPaymentDto, WaivePenaltyDto } from './dto/create-cr-payment.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { getTenantOrgId, getUserAuditEmail } from '../common/tenant.util';

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
  async getOverdueInstallments(@Req() req: any) {
    const orgId = getTenantOrgId(req);
    return this.service.getOverdueInstallments(orgId);
  }

  @Get(':uuid')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get installment plan details and payment vouchers by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    return this.service.findOne(uuid, orgId);
  }

  @Post(':uuid/payments')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Record an installment payment voucher and rebalance dues' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: CreateCrPaymentDto })
  async recordPayment(
    @Param('uuid') uuid: string,
    @Body() dto: CreateCrPaymentDto,
    @Req() req: any,
  ) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.recordPayment(uuid, dto, orgId, userEmail);
  }

  @Post(':uuid/waive-penalty')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Waive or reduce delay penalty for an installment' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: WaivePenaltyDto })
  async waivePenalty(
    @Param('uuid') uuid: string,
    @Body() dto: WaivePenaltyDto,
    @Req() req: any,
  ) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.waivePenalty(uuid, dto, orgId, userEmail);
  }
}

