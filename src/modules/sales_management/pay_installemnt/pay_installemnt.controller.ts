import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InstallmentsService } from './pay_installemnt.service';
import { CreatePaymentDto } from './dto/create-pay_installemnt.dto';

@ApiTags('Installment Plans')
@Controller('installment-plans')
export class InstallmentsController {
  constructor(private readonly service: InstallmentsService) {}

  @Get(':uuid')
  @ApiOperation({ summary: 'Get full details of an installment plan with schedules' })
  @ApiParam({ name: 'uuid', type: 'string', description: 'Installment plan ID or plan code' })
  @ApiResponse({ status: 200, description: 'Plan details fetched successfully' })
  async getPlanDetails(@Param('uuid') uuid: string) {
    return this.service.getPlanDetails(uuid);
  }

  @Post('pay')
  @ApiOperation({ summary: 'Process a payment for a specific installment' })
  @ApiResponse({ status: 201, description: 'Payment processed successfully' })
  async payInstallment(@Body() dto: CreatePaymentDto) {
    return this.service.payInstallment(dto);
  }
}
