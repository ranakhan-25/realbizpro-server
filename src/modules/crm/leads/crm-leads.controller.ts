import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CrmLeadsService } from './crm-leads.service';
import {
  CreateCrmLeadDto,
  UpdateCrmLeadDto,
  CreateCrmLeadRequirementDto,
  CreateCrmLeadPropertyInterestDto,
  CreateCrmLeadActivityDto,
  CreateCrmLeadCallAssignDto,
  TransferCrmLeadDto,
  ChangeCrmLeadStageDto,
} from './dto/create-crm-lead.dto';

@ApiTags('CRM - Leads & Pipeline')
@Controller('crm/leads')
export class CrmLeadsController {
  constructor(private readonly leadsService: CrmLeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new CRM lead' })
  @ApiBody({ type: CreateCrmLeadDto })
  async create(@Body() createDto: CreateCrmLeadDto) {
    return this.leadsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List CRM leads with optional filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'stage_id', required: false, type: Number })
  @ApiQuery({ name: 'category_id', required: false, type: Number })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'assigned_to', required: false })
  async findAll(
    @Query('search') search?: string,
    @Query('stage_id') stage_id?: number,
    @Query('category_id') category_id?: number,
    @Query('priority') priority?: string,
    @Query('assigned_to') assigned_to?: string,
  ) {
    return this.leadsService.findAll({
      search,
      stage_id,
      category_id,
      priority,
      assigned_to,
    });
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get complete lead details with 360-degree timeline by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.leadsService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a CRM lead' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrmLeadDto })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateCrmLeadDto) {
    return this.leadsService.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft delete a CRM lead' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string) {
    return this.leadsService.remove(uuid);
  }

  @Post(':uuid/requirements')
  @ApiOperation({ summary: 'Add a property requirement to a lead' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: CreateCrmLeadRequirementDto })
  async addRequirement(
    @Param('uuid') uuid: string,
    @Body() dto: CreateCrmLeadRequirementDto,
  ) {
    return this.leadsService.addRequirement(uuid, dto);
  }

  @Post(':uuid/property-interests')
  @ApiOperation({ summary: 'Add a property of interest / quotation to a lead' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: CreateCrmLeadPropertyInterestDto })
  async addPropertyInterest(
    @Param('uuid') uuid: string,
    @Body() dto: CreateCrmLeadPropertyInterestDto,
  ) {
    return this.leadsService.addPropertyInterest(uuid, dto);
  }

  @Post(':uuid/activities')
  @ApiOperation({ summary: 'Log a call, meeting, site visit, or follow-up activity' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: CreateCrmLeadActivityDto })
  async addActivity(
    @Param('uuid') uuid: string,
    @Body() dto: CreateCrmLeadActivityDto,
  ) {
    return this.leadsService.addActivity(uuid, dto);
  }

  @Post(':uuid/call-assign')
  @ApiOperation({ summary: 'Assign a call task to a team member' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: CreateCrmLeadCallAssignDto })
  async assignCall(
    @Param('uuid') uuid: string,
    @Body() dto: CreateCrmLeadCallAssignDto,
  ) {
    return this.leadsService.assignCall(uuid, dto);
  }

  @Post(':uuid/transfer')
  @ApiOperation({ summary: 'Transfer lead ownership to another agent' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: TransferCrmLeadDto })
  async transferLead(
    @Param('uuid') uuid: string,
    @Body() dto: TransferCrmLeadDto,
  ) {
    return this.leadsService.transferLead(uuid, dto);
  }

  @Post(':uuid/stage')
  @ApiOperation({ summary: 'Transition lead pipeline stage' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: ChangeCrmLeadStageDto })
  async changeStage(
    @Param('uuid') uuid: string,
    @Body() dto: ChangeCrmLeadStageDto,
  ) {
    return this.leadsService.changeStage(uuid, dto);
  }
}
