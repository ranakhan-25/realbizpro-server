import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CrmMasterService } from './crm-master.service';
import {
  CreateCrmCategoryDto,
  UpdateCrmCategoryDto,
  CreateCrmStageDto,
  UpdateCrmStageDto,
  CreateCrmSourceDto,
  UpdateCrmSourceDto,
  CreateCrmCampaignDto,
  UpdateCrmCampaignDto,
  CreateCrmProfessionDto,
  UpdateCrmProfessionDto,
  CreateCrmTeamDto,
  UpdateCrmTeamDto,
  CreateCrmAreaDto,
  CreateCrmFeatureDto,
} from './dto/create-crm-master.dto';

@ApiTags('CRM - Master Data & Settings')
@Controller('crm/master')
export class CrmMasterController {
  constructor(private readonly masterService: CrmMasterService) {}

  // Categories
  @Post('categories')
  @ApiOperation({ summary: 'Create a new CRM lead category' })
  @ApiBody({ type: CreateCrmCategoryDto })
  async createCategory(@Body() dto: CreateCrmCategoryDto) {
    return this.masterService.createCategory(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all CRM lead categories' })
  async getCategories() {
    return this.masterService.findAllCategories();
  }

  @Get('categories/:uuid')
  @ApiOperation({ summary: 'Get a CRM lead category by UUID' })
  @ApiParam({ name: 'uuid' })
  async getCategoryByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findCategoryByUuid(uuid);
  }

  @Put('categories/:uuid')
  @ApiOperation({ summary: 'Update a CRM lead category' })
  @ApiParam({ name: 'uuid' })
  async updateCategory(@Param('uuid') uuid: string, @Body() dto: UpdateCrmCategoryDto) {
    return this.masterService.updateCategory(uuid, dto);
  }

  @Delete('categories/:uuid')
  @ApiOperation({ summary: 'Delete a CRM lead category' })
  @ApiParam({ name: 'uuid' })
  async deleteCategory(@Param('uuid') uuid: string) {
    return this.masterService.deleteCategory(uuid);
  }

  // Stages
  @Post('stages')
  @ApiOperation({ summary: 'Create a new CRM lead pipeline stage' })
  @ApiBody({ type: CreateCrmStageDto })
  async createStage(@Body() dto: CreateCrmStageDto) {
    return this.masterService.createStage(dto);
  }

  @Get('stages')
  @ApiOperation({ summary: 'Get all CRM pipeline stages' })
  async getStages() {
    return this.masterService.findAllStages();
  }

  @Put('stages/:uuid')
  @ApiOperation({ summary: 'Update a CRM pipeline stage' })
  @ApiParam({ name: 'uuid' })
  async updateStage(@Param('uuid') uuid: string, @Body() dto: UpdateCrmStageDto) {
    return this.masterService.updateStage(uuid, dto);
  }

  // Sources
  @Post('sources')
  @ApiOperation({ summary: 'Create a new lead source' })
  @ApiBody({ type: CreateCrmSourceDto })
  async createSource(@Body() dto: CreateCrmSourceDto) {
    return this.masterService.createSource(dto);
  }

  @Get('sources')
  @ApiOperation({ summary: 'Get all lead sources' })
  async getSources() {
    return this.masterService.findAllSources();
  }

  // Campaigns
  @Post('campaigns')
  @ApiOperation({ summary: 'Create a marketing campaign' })
  @ApiBody({ type: CreateCrmCampaignDto })
  async createCampaign(@Body() dto: CreateCrmCampaignDto) {
    return this.masterService.createCampaign(dto);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Get all marketing campaigns' })
  async getCampaigns() {
    return this.masterService.findAllCampaigns();
  }

  // Professions
  @Post('professions')
  @ApiOperation({ summary: 'Create a profession' })
  @ApiBody({ type: CreateCrmProfessionDto })
  async createProfession(@Body() dto: CreateCrmProfessionDto) {
    return this.masterService.createProfession(dto);
  }

  @Get('professions')
  @ApiOperation({ summary: 'Get all professions' })
  async getProfessions() {
    return this.masterService.findAllProfessions();
  }

  // Teams
  @Post('teams')
  @ApiOperation({ summary: 'Create a sales team' })
  @ApiBody({ type: CreateCrmTeamDto })
  async createTeam(@Body() dto: CreateCrmTeamDto) {
    return this.masterService.createTeam(dto);
  }

  @Get('teams')
  @ApiOperation({ summary: 'Get all sales teams with members' })
  async getTeams() {
    return this.masterService.findAllTeams();
  }

  @Post('teams/:uuid/members')
  @ApiOperation({ summary: 'Add a member to a sales team' })
  @ApiParam({ name: 'uuid' })
  async addTeamMember(
    @Param('uuid') uuid: string,
    @Body() body: { user_id: string; role_in_team?: string },
  ) {
    return this.masterService.addTeamMember(uuid, body);
  }

  // Areas
  @Post('areas')
  @ApiOperation({ summary: 'Create an area' })
  @ApiBody({ type: CreateCrmAreaDto })
  async createArea(@Body() dto: CreateCrmAreaDto) {
    return this.masterService.createArea(dto);
  }

  @Get('areas')
  @ApiOperation({ summary: 'Get all areas' })
  async getAreas() {
    return this.masterService.findAllAreas();
  }

  // Features
  @Post('features')
  @ApiOperation({ summary: 'Create a feature' })
  @ApiBody({ type: CreateCrmFeatureDto })
  async createFeature(@Body() dto: CreateCrmFeatureDto) {
    return this.masterService.createFeature(dto);
  }

  @Get('features')
  @ApiOperation({ summary: 'Get all features' })
  async getFeatures() {
    return this.masterService.findAllFeatures();
  }
}
