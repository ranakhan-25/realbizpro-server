import {
  Controller,
  Post,
  Get,
  Patch,
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
import { CrWaiverService } from './cr-waiver.service';
import {
  CreateCrWaiverDto,
  UpdateCrWaiverStatusDto,
} from './dto/create-cr-waiver.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { getTenantOrgId, getUserAuditEmail } from '../common/tenant.util';

@ApiTags('Credit Realization - Penalty Waiver Requests & Approval')
@ApiBearerAuth()
@Controller('credit-realization/waivers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrWaiverController {
  constructor(private readonly service: CrWaiverService) {}

  @Post()
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Submit delay penalty waiver request' })
  @ApiBody({ type: CreateCrWaiverDto })
  async create(@Body() createDto: CreateCrWaiverDto, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.create(createDto, orgId, userEmail);
  }

  @Get()
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'List all penalty waiver requests' })
  @ApiQuery({ name: 'sale_agreement_id', required: false })
  @ApiQuery({ name: 'approval_status', required: false })
  async findAll(
    @Query('sale_agreement_id') saleAgreementId?: string,
    @Query('approval_status') approvalStatus?: string,
    @Req() req?: any,
  ) {
    const orgId = getTenantOrgId(req);
    return this.service.findAll({
      org_id: orgId,
      sale_agreement_id: saleAgreementId ? parseInt(saleAgreementId, 10) : undefined,
      approval_status: approvalStatus,
    });
  }

  @Get(':uuid')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get waiver request details by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    return this.service.findOne(uuid, orgId);
  }

  @Patch(':uuid/status')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Approve or reject penalty waiver request' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrWaiverStatusDto })
  async updateStatus(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateCrWaiverStatusDto,
    @Req() req: any,
  ) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.updateStatus(uuid, dto, orgId, userEmail);
  }

  @Delete(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Delete pending waiver request' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.remove(uuid, orgId, userEmail);
  }
}

