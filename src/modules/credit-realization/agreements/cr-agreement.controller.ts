import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CrAgreementService } from './cr-agreement.service';
import {
  CreateCrSaleAgreementDto,
  UpdateCrSaleAgreementDto,
  CreateCrPlotDistributionDto,
} from './dto/create-cr-agreement.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { getTenantOrgId, getUserAuditEmail } from '../common/tenant.util';

@ApiTags('Credit Realization - Sale Agreements & Allotments')
@ApiBearerAuth()
@Controller('credit-realization/agreements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrAgreementController {
  constructor(private readonly agreementService: CrAgreementService) {}

  @Post()
  @Permissions('credit-realization:write')
  @ApiOperation({
    summary: 'Create a sale agreement and optionally auto-generate installment schedules',
  })
  @ApiBody({ type: CreateCrSaleAgreementDto })
  async create(@Body() createDto: CreateCrSaleAgreementDto, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.agreementService.create(createDto, orgId, userEmail);
  }

  @Get()
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'List all sale agreements with installment schedule status' })
  async findAll(@Req() req: any) {
    const orgId = getTenantOrgId(req);
    return this.agreementService.findAll(orgId);
  }

  @Get(':uuid')
  @Permissions('credit-realization:read')
  @ApiOperation({
    summary: 'Get sale agreement details with full installment plan, plots & recovery history',
  })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    return this.agreementService.findOne(uuid, orgId);
  }

  @Put(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Update a sale agreement' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrSaleAgreementDto })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateCrSaleAgreementDto,
    @Req() req: any,
  ) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.agreementService.update(uuid, updateDto, orgId, userEmail);
  }

  @Delete(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Delete a sale agreement' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.agreementService.remove(uuid, orgId, userEmail);
  }

  @Post(':uuid/plot-distribution')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Allocate / attach plot distribution info to agreement' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: CreateCrPlotDistributionDto })
  async addPlotDistribution(
    @Param('uuid') uuid: string,
    @Body() dto: CreateCrPlotDistributionDto,
    @Req() req: any,
  ) {
    const orgId = getTenantOrgId(req);
    return this.agreementService.addPlotDistribution(uuid, dto, orgId);
  }
}

