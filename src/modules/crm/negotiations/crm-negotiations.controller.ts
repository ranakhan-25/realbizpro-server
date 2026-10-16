import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CrmNegotiationsService } from './crm-negotiations.service';
import {
  CreateCrmNegotiationDto,
  UpdateCrmNegotiationDto,
  ApproveCrmNegotiationDto,
} from './dto/create-crm-negotiation.dto';

@ApiTags('CRM - Deal Negotiations & Approvals')
@Controller('crm/negotiations')
export class CrmNegotiationsController {
  constructor(private readonly service: CrmNegotiationsService) {}

  @Post()
  @ApiOperation({ summary: 'Initiate a deal price negotiation' })
  @ApiBody({ type: CreateCrmNegotiationDto })
  async create(@Body() createDto: CreateCrmNegotiationDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all deal negotiations' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get deal negotiation by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update deal negotiation' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrmNegotiationDto })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateCrmNegotiationDto) {
    return this.service.update(uuid, updateDto);
  }

  @Post(':uuid/approve')
  @ApiOperation({ summary: 'Approve or reject deal negotiation' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: ApproveCrmNegotiationDto })
  async approve(@Param('uuid') uuid: string, @Body() dto: ApproveCrmNegotiationDto) {
    return this.service.approve(uuid, dto);
  }
}
