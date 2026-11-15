import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PaymentVouchersService } from './payment-vouchers.service';
import { CreatePaymentVoucherDto } from './dto/create-payment-voucher.dto';
import { UpdatePaymentVoucherDto } from './dto/update-payment-voucher.dto';
import { GetPaymentVouchersQueryDto } from './dto/query-payment-voucher.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('Accounts | vouchers | payment-vouchers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payment-vouchers')
export class PaymentVouchersController {
  constructor(private readonly paymentVouchersService: PaymentVouchersService) {}

  @Post()
  @Permissions('create_payment_voucher')
  @ApiOperation({ summary: 'Create payment voucher' })
  create(
    @Body() dto: CreatePaymentVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.paymentVouchersService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_payment_voucher')
  @ApiOperation({ summary: 'List payment vouchers' })
  findAll(
    @Query() query: GetPaymentVouchersQueryDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.paymentVouchersService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_payment_voucher')
  @ApiOperation({ summary: 'Get payment voucher by UUID' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.paymentVouchersService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_payment_voucher')
  @ApiOperation({ summary: 'Update payment voucher (PATCH)' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdatePaymentVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.paymentVouchersService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_payment_voucher')
  @ApiOperation({ summary: 'Delete payment voucher' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.paymentVouchersService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_payment_voucher')
  @ApiOperation({ summary: 'Restore payment voucher' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.paymentVouchersService.restore(uuid, userId, currentUser);
  }
}
