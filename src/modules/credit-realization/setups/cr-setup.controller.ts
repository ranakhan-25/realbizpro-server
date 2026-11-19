import { Controller, Post, Get, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CrSetupService } from './cr-setup.service';
import {
  CreateCrInstallmentSetupDto,
  UpdateCrInstallmentSetupDto,
} from './dto/create-cr-setup.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { getTenantOrgId, getUserAuditEmail } from '../common/tenant.util';

@ApiTags('Credit Realization - Installment Setups & Policies')
@ApiBearerAuth()
@Controller('credit-realization/setups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrSetupController {
  constructor(private readonly service: CrSetupService) {}

  @Post()
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Create an installment policy plan setup' })
  @ApiBody({ type: CreateCrInstallmentSetupDto })
  async create(@Body() createDto: CreateCrInstallmentSetupDto, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.create(createDto, orgId, userEmail);
  }

  @Get()
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'List all installment setups' })
  async findAll(@Req() req: any) {
    const orgId = getTenantOrgId(req);
    return this.service.findAll(orgId);
  }

  @Get(':uuid')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get installment setup by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    return this.service.findOne(uuid, orgId);
  }

  @Put(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Update installment setup' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrInstallmentSetupDto })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateCrInstallmentSetupDto,
    @Req() req: any,
  ) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.update(uuid, updateDto, orgId, userEmail);
  }

  @Delete(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Delete installment setup' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.remove(uuid, orgId, userEmail);
  }
}

