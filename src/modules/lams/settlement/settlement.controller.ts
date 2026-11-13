import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SettlementService } from './settlement.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { CreateSettlementPaymentDto } from './dto/create-settlement-payment.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/auth.decorators';

@ApiTags('LAMS - Final Settlements & Agreements')
@ApiBearerAuth()
@Controller('lams/settlements')
@UseGuards(JwtAuthGuard)
export class SettlementController {
  constructor(private readonly service: SettlementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new settlement record' })
  async create(@Body() createDto: CreateSettlementDto, @CurrentUser() user: any) {
    return this.service.create(createDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all settlement records' })
  async findAll(
    @CurrentUser() user: any,
    @Query('lead_id') leadId?: string,
    @Query('org_id') queryOrgId?: string,
  ) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || queryOrgId;
    return this.service.findAll({ lead_id: leadId, org_id: orgId });
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a settlement record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the settlement record' })
  async findOne(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    return this.service.findOne(uuid, orgId);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a settlement record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the settlement record' })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateSettlementDto,
    @CurrentUser() user: any,
  ) {
    return this.service.update(uuid, updateDto, user);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a settlement record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the settlement record' })
  async remove(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    return this.service.remove(uuid, user);
  }

  @Post(':uuid/payments')
  @ApiOperation({ summary: 'Record an installment payment against a settlement' })
  @ApiParam({ name: 'uuid', description: 'UUID of the settlement record' })
  async recordPayment(
    @Param('uuid') uuid: string,
    @Body() paymentDto: CreateSettlementPaymentDto,
    @CurrentUser() user: any,
  ) {
    return this.service.recordPayment(uuid, paymentDto, user);
  }

  @Get(':uuid/payments')
  @ApiOperation({ summary: 'Get list of recorded installment payments for a settlement' })
  @ApiParam({ name: 'uuid', description: 'UUID of the settlement record' })
  async getPayments(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    return this.service.getPayments(uuid, orgId);
  }
}
