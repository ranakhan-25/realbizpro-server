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
import { NegotiationProcessService } from './negotiation-process.service';
import { CreateNegotiationProcessDto } from './dto/create-negotiation-process.dto';
import { UpdateNegotiationProcessDto } from './dto/update-negotiation-process.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CurrentUser } from '@/common/decorators/auth.decorators';

@ApiTags('LAMS - Negotiation Processes')
@ApiBearerAuth()
@Controller('lams/negotiation-processes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NegotiationProcessController {
  constructor(private readonly service: NegotiationProcessService) {}

  @Post()
  @Permissions('lams_negotiation_process.create')
  @ApiOperation({ summary: 'Record a new negotiation meeting round' })
  async create(@Body() createDto: CreateNegotiationProcessDto, @CurrentUser() user: any) {
    return this.service.create(createDto, user);
  }

  @Get()
  @Permissions('lams_negotiation_process.read')
  @ApiOperation({ summary: 'Get all negotiation rounds with filters' })
  async findAll(
    @CurrentUser() user: any,
    @Query('org_id') queryOrgId?: string,
    @Query('lead_id') leadId?: string,
    @Query('negotiation_status') status?: string,
    @Query('from_date') fromDate?: string,
    @Query('to_date') toDate?: string,
  ) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || queryOrgId;
    return this.service.findAll({
      org_id: orgId,
      lead_id: leadId,
      negotiation_status: status,
      from_date: fromDate,
      to_date: toDate,
    });
  }

  @Get(':uuid')
  @Permissions('lams_negotiation_process.read')
  @ApiOperation({ summary: 'Get a negotiation process by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the negotiation process' })
  async findOne(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    return this.service.findOne(uuid, orgId);
  }

  @Put(':uuid')
  @Permissions('lams_negotiation_process.update')
  @ApiOperation({ summary: 'Update a negotiation process by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the negotiation process' })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateNegotiationProcessDto,
    @CurrentUser() user: any,
  ) {
    return this.service.update(uuid, updateDto, user);
  }

  @Delete(':uuid')
  @Permissions('lams_negotiation_process.delete')
  @ApiOperation({ summary: 'Delete a negotiation process by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the negotiation process' })
  async remove(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    return this.service.remove(uuid, user);
  }
}
