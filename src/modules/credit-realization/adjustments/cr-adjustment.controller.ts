import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CrAdjustmentService } from './cr-adjustment.service';
import { CreateCrAdjustmentDto } from './dto/create-cr-adjustment.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { getTenantOrgId, getUserAuditEmail } from '../common/tenant.util';

@ApiTags('Credit Realization - Financial Adjustments & Credit/Debit Notes')
@ApiBearerAuth()
@Controller('credit-realization/adjustments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrAdjustmentController {
  constructor(private readonly service: CrAdjustmentService) {}

  @Post()
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Create financial adjustment (credit note, debit note, or rounding)' })
  @ApiBody({ type: CreateCrAdjustmentDto })
  async create(@Body() createDto: CreateCrAdjustmentDto, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.create(createDto, orgId, userEmail);
  }

  @Get()
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'List all financial adjustments' })
  @ApiQuery({ name: 'sale_agreement_id', required: false })
  @ApiQuery({ name: 'adjustment_type', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Query('sale_agreement_id') saleAgreementId?: string,
    @Query('adjustment_type') adjustmentType?: string,
    @Query('status') status?: string,
    @Req() req?: any,
  ) {
    const orgId = getTenantOrgId(req);
    return this.service.findAll({
      org_id: orgId,
      sale_agreement_id: saleAgreementId ? parseInt(saleAgreementId, 10) : undefined,
      adjustment_type: adjustmentType,
      status,
    });
  }

  @Get(':uuid')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get adjustment details by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    return this.service.findOne(uuid, orgId);
  }

  @Post(':uuid/reverse')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Reverse a previously applied financial adjustment' })
  @ApiParam({ name: 'uuid' })
  async reverse(
    @Param('uuid') uuid: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.reverse(uuid, orgId, userEmail, reason);
  }

  @Delete(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Delete financial adjustment' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.remove(uuid, orgId, userEmail);
  }
}

