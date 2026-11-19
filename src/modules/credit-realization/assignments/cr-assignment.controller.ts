import {
  Controller,
  Post,
  Get,
  Put,
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
import { CrAssignmentService } from './cr-assignment.service';
import {
  CreateCrAssignmentDto,
  UpdateCrAssignmentDto,
} from './dto/create-cr-assignment.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { getTenantOrgId, getUserAuditEmail } from '../common/tenant.util';

@ApiTags('Credit Realization - Recovery Officer Assignments')
@ApiBearerAuth()
@Controller('credit-realization/assignments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrAssignmentController {
  constructor(private readonly service: CrAssignmentService) {}

  @Post()
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Assign recovery officer to sale agreement or customer' })
  @ApiBody({ type: CreateCrAssignmentDto })
  async create(@Body() createDto: CreateCrAssignmentDto, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.create(createDto, orgId, userEmail);
  }

  @Post('bulk')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Bulk assign multiple sale agreements to an officer' })
  async bulkAssign(
    @Body()
    body: {
      officer_id: string;
      officer_name: string;
      sale_agreement_ids: number[];
      due_date: string;
      notes?: string;
    },
    @Req() req: any,
  ) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.bulkAssign(body, orgId, userEmail);
  }

  @Get()
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'List all recovery officer assignments' })
  @ApiQuery({ name: 'officer_id', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'sale_agreement_id', required: false })
  async findAll(
    @Query('officer_id') officerId?: string,
    @Query('status') status?: string,
    @Query('sale_agreement_id') saleAgreementId?: string,
    @Req() req?: any,
  ) {
    const orgId = getTenantOrgId(req);
    return this.service.findAll({
      org_id: orgId,
      officer_id: officerId,
      status,
      sale_agreement_id: saleAgreementId ? parseInt(saleAgreementId, 10) : undefined,
    });
  }

  @Get(':uuid')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get officer assignment details by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    return this.service.findOne(uuid, orgId);
  }

  @Put(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Update officer assignment (PUT)' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrAssignmentDto })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateCrAssignmentDto,
    @Req() req: any,
  ) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.update(uuid, updateDto, orgId, userEmail);
  }

  @Patch(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Update officer assignment (PATCH)' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrAssignmentDto })
  async patch(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateCrAssignmentDto,
    @Req() req: any,
  ) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.update(uuid, updateDto, orgId, userEmail);
  }

  @Post(':uuid/sync-progress')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Recalculate collected amount and status against actual receipts' })
  @ApiParam({ name: 'uuid' })
  async syncProgress(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    return this.service.syncProgress(uuid, orgId);
  }

  @Delete(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Delete officer assignment' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string, @Req() req: any) {
    const orgId = getTenantOrgId(req);
    const userEmail = getUserAuditEmail(req);
    return this.service.remove(uuid, orgId, userEmail);
  }
}

