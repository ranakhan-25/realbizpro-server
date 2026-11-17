import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, ParseUUIDPipe, Patch, Post, Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommissionsService } from './commission_form.service';
import { CreateCommissionDto, QueryCommissionDto, RestoreCommissionDto, UpdateCommissionDto } from './dto';
import { Commission } from 'src/database/models/sales_management/sm_commission_form_model';
import { Agent } from 'src/database/models/sales_management/sm_commission_form_agent_model';

@ApiTags('Commissions_Form')
@Controller('commissions')
export class CommissionsController {
  constructor(private readonly service: CommissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new commission rule' })
  @ApiResponse({ status: 201, type: Commission })
  create(@Body() dto: CreateCommissionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List commission rules (search / filter / pagination)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'agentUuid', required: false, type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'propertyType', required: false })
  @ApiQuery({ name: 'commissionType', required: false, enum: ['percentage', 'flat'] })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query: QueryCommissionDto) {
    return this.service.findAll(query);
  }

  @Get('agents')
  @ApiOperation({ summary: 'List all active agents (for form dropdown)' })
  @ApiResponse({ status: 200, type: [Agent] })
  findAgents() {
    return this.service.findAgents();
  }

  @Get('trash')
  @ApiOperation({ summary: 'List soft-deleted commission rules' })
  findDeleted() {
    return this.service.findDeleted();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get commission rule by UUID' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid', required: true })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update commission rule' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid', required: true })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateCommissionDto) {
    return this.service.update(uuid, dto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete commission rule' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid', required: true })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.remove(uuid);
  }

  @Delete(':uuid/force')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete commission rule' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid', required: true })
  forceRemove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.forceRemove(uuid);
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a single soft-deleted commission rule' })
  restore(@Body() dto: RestoreCommissionDto) {
    return this.service.restore(dto);
  }

  @Post('restore-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore all soft-deleted commission rules' })
  restoreAll() {
    return this.service.restoreAll();
  }
}
