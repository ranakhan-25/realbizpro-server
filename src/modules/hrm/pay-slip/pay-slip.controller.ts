import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import type { JwtAuthUser } from 'src/common/types/jwt-user.type';
import { PaySlipService } from './pay-slip.service';

@ApiTags('HRM | pay slips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay-slip')
export class PaySlipController {
  constructor(
    private readonly paySlipService: PaySlipService,
  ) {}

  @Post('process')
  @ApiOperation({
    summary:
      'Generate monthly employee pay slips from gross salary and recorded workday attendance',
  })
  process(
    @Body()
    body: { month?: string; year?: number },
    @CurrentUser() user: JwtAuthUser,
  ) {
    return this.paySlipService.processPeriod(
      body,
      user,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'List generated pay slips by period and search',
  })
  list(
    @Query()
    query: {
      month?: string;
      year?: string;
      search?: string;
    },
    @CurrentUser() user: JwtAuthUser,
  ) {
    return this.paySlipService.list(query, user);
  }

  @Get('bank')
  @ApiOperation({
    summary:
      'List pay slips available for bank and cash payment allocation',
  })
  bankList(
    @Query()
    query: {
      month?: string;
      year?: string;
      search?: string;
    },
    @CurrentUser() user: JwtAuthUser,
  ) {
    return this.paySlipService.list(query, user);
  }

  @Patch(':uuid/payment-split')
  @ApiOperation({
    summary:
      'Allocate a pay slip between bank and cash payments',
  })
  updateSplit(
    @Param('uuid') uuid: string,
    @Body()
    body: {
      bankPayableAmount?: number;
      cashPayableAmount?: number;
    },
    @CurrentUser() user: JwtAuthUser,
  ) {
    return this.paySlipService.updatePaymentSplit(
      uuid,
      body,
      user,
    );
  }
}
