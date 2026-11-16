import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { CustomerServiceSettingsService } from './customer-service-settings.service';
import {
  CreateServiceRuleDto,
  UpdateServiceRuleDto,
  QueryServiceRuleDto,
} from './dto';

@ApiTags('Customer Service Settings - Workflow Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-service/settings/workflow-rules')
export class CustomerServiceSettingsController {
  constructor(
    private readonly settingsService: CustomerServiceSettingsService,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get workflow rules SLA and routing statistics' })
  async getStats(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.settingsService.getWorkflowRuleStats(user, projectId);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of service workflow rules' })
  async findAll(
    @CurrentUser() user: any,
    @Query() query: QueryServiceRuleDto,
  ) {
    return this.settingsService.findAllWorkflowRules(user, query);
  }

  @Post('reload')
  @ApiOperation({ summary: 'Reload SLA & workflow rules engine cache' })
  async reloadEngine(@CurrentUser() user: any) {
    return this.settingsService.reloadWorkflowEngine(user);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get single workflow rule details by UUID' })
  async findOne(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.settingsService.findWorkflowRuleByUuid(user, uuid);
  }

  @Post()
  @ApiOperation({ summary: 'Create new workflow rule' })
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateServiceRuleDto,
  ) {
    return this.settingsService.createWorkflowRule(user, dto);
  }

  @Patch(':uuid/toggle')
  @ApiOperation({ summary: 'Toggle workflow rule status (Active/Disabled)' })
  async toggleStatus(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.settingsService.toggleWorkflowRuleStatus(user, uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update workflow rule' })
  async update(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateServiceRuleDto,
  ) {
    return this.settingsService.updateWorkflowRule(user, uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete workflow rule' })
  async remove(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.settingsService.deleteWorkflowRule(user, uuid);
  }
}
