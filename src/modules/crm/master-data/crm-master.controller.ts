import { Controller, Post, Get, Put, Patch, Delete, Body, Param } from '@nestjs/common';
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
  UpdateCrmAreaDto,
  CreateCrmFeatureDto,
  UpdateCrmFeatureDto,
  CreateCrmPriceRangeDto,
  UpdateCrmPriceRangeDto,
  CreateCrmRequirementTypeDto,
  UpdateCrmRequirementTypeDto,
  CreateCrmVisitPlaceDto,
  UpdateCrmVisitPlaceDto,
  CreateCrmVisitStatusDto,
  UpdateCrmVisitStatusDto,
  CreateCrmTaskTypeDto,
  UpdateCrmTaskTypeDto,
} from './dto/create-crm-master.dto';

@ApiTags('CRM - Master Data & Settings')
@Controller('crm/master')
export class CrmMasterController {
  constructor(private readonly masterService: CrmMasterService) {}

  // ----------------------------------------------------
  // Categories
  // ----------------------------------------------------
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
  @ApiOperation({ summary: 'Update a CRM lead category (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateCategory(@Param('uuid') uuid: string, @Body() dto: UpdateCrmCategoryDto) {
    return this.masterService.updateCategory(uuid, dto);
  }

  @Patch('categories/:uuid')
  @ApiOperation({ summary: 'Update a CRM lead category (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchCategory(@Param('uuid') uuid: string, @Body() dto: UpdateCrmCategoryDto) {
    return this.masterService.updateCategory(uuid, dto);
  }

  @Delete('categories/:uuid')
  @ApiOperation({ summary: 'Delete a CRM lead category' })
  @ApiParam({ name: 'uuid' })
  async deleteCategory(@Param('uuid') uuid: string) {
    return this.masterService.deleteCategory(uuid);
  }

  // ----------------------------------------------------
  // Stages
  // ----------------------------------------------------
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

  @Get('stages/:uuid')
  @ApiOperation({ summary: 'Get a CRM pipeline stage by UUID' })
  @ApiParam({ name: 'uuid' })
  async getStageByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findStageByUuid(uuid);
  }

  @Put('stages/:uuid')
  @ApiOperation({ summary: 'Update a CRM pipeline stage (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateStage(@Param('uuid') uuid: string, @Body() dto: UpdateCrmStageDto) {
    return this.masterService.updateStage(uuid, dto);
  }

  @Patch('stages/:uuid')
  @ApiOperation({ summary: 'Update a CRM pipeline stage (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchStage(@Param('uuid') uuid: string, @Body() dto: UpdateCrmStageDto) {
    return this.masterService.updateStage(uuid, dto);
  }

  @Delete('stages/:uuid')
  @ApiOperation({ summary: 'Delete a CRM pipeline stage' })
  @ApiParam({ name: 'uuid' })
  async deleteStage(@Param('uuid') uuid: string) {
    return this.masterService.deleteStage(uuid);
  }

  // ----------------------------------------------------
  // Sources
  // ----------------------------------------------------
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

  @Get('sources/:uuid')
  @ApiOperation({ summary: 'Get lead source by UUID' })
  @ApiParam({ name: 'uuid' })
  async getSourceByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findSourceByUuid(uuid);
  }

  @Put('sources/:uuid')
  @ApiOperation({ summary: 'Update a lead source (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateSource(@Param('uuid') uuid: string, @Body() dto: UpdateCrmSourceDto) {
    return this.masterService.updateSource(uuid, dto);
  }

  @Patch('sources/:uuid')
  @ApiOperation({ summary: 'Update a lead source (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchSource(@Param('uuid') uuid: string, @Body() dto: UpdateCrmSourceDto) {
    return this.masterService.updateSource(uuid, dto);
  }

  @Delete('sources/:uuid')
  @ApiOperation({ summary: 'Delete a lead source' })
  @ApiParam({ name: 'uuid' })
  async deleteSource(@Param('uuid') uuid: string) {
    return this.masterService.deleteSource(uuid);
  }

  // ----------------------------------------------------
  // Campaigns
  // ----------------------------------------------------
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

  @Get('campaigns/:uuid')
  @ApiOperation({ summary: 'Get a marketing campaign by UUID' })
  @ApiParam({ name: 'uuid' })
  async getCampaignByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findCampaignByUuid(uuid);
  }

  @Put('campaigns/:uuid')
  @ApiOperation({ summary: 'Update a marketing campaign (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateCampaign(@Param('uuid') uuid: string, @Body() dto: UpdateCrmCampaignDto) {
    return this.masterService.updateCampaign(uuid, dto);
  }

  @Patch('campaigns/:uuid')
  @ApiOperation({ summary: 'Update a marketing campaign (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchCampaign(@Param('uuid') uuid: string, @Body() dto: UpdateCrmCampaignDto) {
    return this.masterService.updateCampaign(uuid, dto);
  }

  @Delete('campaigns/:uuid')
  @ApiOperation({ summary: 'Delete a marketing campaign' })
  @ApiParam({ name: 'uuid' })
  async deleteCampaign(@Param('uuid') uuid: string) {
    return this.masterService.deleteCampaign(uuid);
  }

  // ----------------------------------------------------
  // Professions
  // ----------------------------------------------------
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

  @Get('professions/:uuid')
  @ApiOperation({ summary: 'Get a profession by UUID' })
  @ApiParam({ name: 'uuid' })
  async getProfessionByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findProfessionByUuid(uuid);
  }

  @Put('professions/:uuid')
  @ApiOperation({ summary: 'Update a profession (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateProfession(@Param('uuid') uuid: string, @Body() dto: UpdateCrmProfessionDto) {
    return this.masterService.updateProfession(uuid, dto);
  }

  @Patch('professions/:uuid')
  @ApiOperation({ summary: 'Update a profession (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchProfession(@Param('uuid') uuid: string, @Body() dto: UpdateCrmProfessionDto) {
    return this.masterService.updateProfession(uuid, dto);
  }

  @Delete('professions/:uuid')
  @ApiOperation({ summary: 'Delete a profession' })
  @ApiParam({ name: 'uuid' })
  async deleteProfession(@Param('uuid') uuid: string) {
    return this.masterService.deleteProfession(uuid);
  }

  // ----------------------------------------------------
  // Teams & Team Members
  // ----------------------------------------------------
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

  @Get('teams/:uuid')
  @ApiOperation({ summary: 'Get a sales team by UUID' })
  @ApiParam({ name: 'uuid' })
  async getTeamByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findTeamByUuid(uuid);
  }

  @Put('teams/:uuid')
  @ApiOperation({ summary: 'Update a sales team (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateTeam(@Param('uuid') uuid: string, @Body() dto: UpdateCrmTeamDto) {
    return this.masterService.updateTeam(uuid, dto);
  }

  @Patch('teams/:uuid')
  @ApiOperation({ summary: 'Update a sales team (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchTeam(@Param('uuid') uuid: string, @Body() dto: UpdateCrmTeamDto) {
    return this.masterService.updateTeam(uuid, dto);
  }

  @Delete('teams/:uuid')
  @ApiOperation({ summary: 'Delete a sales team' })
  @ApiParam({ name: 'uuid' })
  async deleteTeam(@Param('uuid') uuid: string) {
    return this.masterService.deleteTeam(uuid);
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

  // ----------------------------------------------------
  // Areas
  // ----------------------------------------------------
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

  @Get('areas/:uuid')
  @ApiOperation({ summary: 'Get an area by UUID' })
  @ApiParam({ name: 'uuid' })
  async getAreaByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findAreaByUuid(uuid);
  }

  @Put('areas/:uuid')
  @ApiOperation({ summary: 'Update an area (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateArea(@Param('uuid') uuid: string, @Body() dto: UpdateCrmAreaDto) {
    return this.masterService.updateArea(uuid, dto);
  }

  @Patch('areas/:uuid')
  @ApiOperation({ summary: 'Update an area (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchArea(@Param('uuid') uuid: string, @Body() dto: UpdateCrmAreaDto) {
    return this.masterService.updateArea(uuid, dto);
  }

  @Delete('areas/:uuid')
  @ApiOperation({ summary: 'Delete an area' })
  @ApiParam({ name: 'uuid' })
  async deleteArea(@Param('uuid') uuid: string) {
    return this.masterService.deleteArea(uuid);
  }

  // ----------------------------------------------------
  // Features
  // ----------------------------------------------------
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

  @Get('features/:uuid')
  @ApiOperation({ summary: 'Get a feature by UUID' })
  @ApiParam({ name: 'uuid' })
  async getFeatureByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findFeatureByUuid(uuid);
  }

  @Put('features/:uuid')
  @ApiOperation({ summary: 'Update a feature (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateFeature(@Param('uuid') uuid: string, @Body() dto: UpdateCrmFeatureDto) {
    return this.masterService.updateFeature(uuid, dto);
  }

  @Patch('features/:uuid')
  @ApiOperation({ summary: 'Update a feature (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchFeature(@Param('uuid') uuid: string, @Body() dto: UpdateCrmFeatureDto) {
    return this.masterService.updateFeature(uuid, dto);
  }

  @Delete('features/:uuid')
  @ApiOperation({ summary: 'Delete a feature' })
  @ApiParam({ name: 'uuid' })
  async deleteFeature(@Param('uuid') uuid: string) {
    return this.masterService.deleteFeature(uuid);
  }

  // ----------------------------------------------------
  // Price Ranges
  // ----------------------------------------------------
  @Post('price-ranges')
  @ApiOperation({ summary: 'Create a price range' })
  @ApiBody({ type: CreateCrmPriceRangeDto })
  async createPriceRange(@Body() dto: CreateCrmPriceRangeDto) {
    return this.masterService.createPriceRange(dto);
  }

  @Get('price-ranges')
  @ApiOperation({ summary: 'Get all price ranges' })
  async getPriceRanges() {
    return this.masterService.findAllPriceRanges();
  }

  @Get('price-ranges/:uuid')
  @ApiOperation({ summary: 'Get a price range by UUID' })
  @ApiParam({ name: 'uuid' })
  async getPriceRangeByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findPriceRangeByUuid(uuid);
  }

  @Put('price-ranges/:uuid')
  @ApiOperation({ summary: 'Update a price range (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updatePriceRange(@Param('uuid') uuid: string, @Body() dto: UpdateCrmPriceRangeDto) {
    return this.masterService.updatePriceRange(uuid, dto);
  }

  @Patch('price-ranges/:uuid')
  @ApiOperation({ summary: 'Update a price range (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchPriceRange(@Param('uuid') uuid: string, @Body() dto: UpdateCrmPriceRangeDto) {
    return this.masterService.updatePriceRange(uuid, dto);
  }

  @Delete('price-ranges/:uuid')
  @ApiOperation({ summary: 'Delete a price range' })
  @ApiParam({ name: 'uuid' })
  async deletePriceRange(@Param('uuid') uuid: string) {
    return this.masterService.deletePriceRange(uuid);
  }

  // ----------------------------------------------------
  // Requirement Types
  // ----------------------------------------------------
  @Post('requirement-types')
  @ApiOperation({ summary: 'Create a requirement type' })
  @ApiBody({ type: CreateCrmRequirementTypeDto })
  async createRequirementType(@Body() dto: CreateCrmRequirementTypeDto) {
    return this.masterService.createRequirementType(dto);
  }

  @Get('requirement-types')
  @ApiOperation({ summary: 'Get all requirement types' })
  async getRequirementTypes() {
    return this.masterService.findAllRequirementTypes();
  }

  @Get('requirement-types/:uuid')
  @ApiOperation({ summary: 'Get a requirement type by UUID' })
  @ApiParam({ name: 'uuid' })
  async getRequirementTypeByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findRequirementTypeByUuid(uuid);
  }

  @Put('requirement-types/:uuid')
  @ApiOperation({ summary: 'Update a requirement type (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateRequirementType(@Param('uuid') uuid: string, @Body() dto: UpdateCrmRequirementTypeDto) {
    return this.masterService.updateRequirementType(uuid, dto);
  }

  @Patch('requirement-types/:uuid')
  @ApiOperation({ summary: 'Update a requirement type (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchRequirementType(@Param('uuid') uuid: string, @Body() dto: UpdateCrmRequirementTypeDto) {
    return this.masterService.updateRequirementType(uuid, dto);
  }

  @Delete('requirement-types/:uuid')
  @ApiOperation({ summary: 'Delete a requirement type' })
  @ApiParam({ name: 'uuid' })
  async deleteRequirementType(@Param('uuid') uuid: string) {
    return this.masterService.deleteRequirementType(uuid);
  }

  // ----------------------------------------------------
  // Visit Places
  // ----------------------------------------------------
  @Post('visit-places')
  @ApiOperation({ summary: 'Create a visit place' })
  @ApiBody({ type: CreateCrmVisitPlaceDto })
  async createVisitPlace(@Body() dto: CreateCrmVisitPlaceDto) {
    return this.masterService.createVisitPlace(dto);
  }

  @Get('visit-places')
  @ApiOperation({ summary: 'Get all visit places' })
  async getVisitPlaces() {
    return this.masterService.findAllVisitPlaces();
  }

  @Get('visit-places/:uuid')
  @ApiOperation({ summary: 'Get a visit place by UUID' })
  @ApiParam({ name: 'uuid' })
  async getVisitPlaceByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findVisitPlaceByUuid(uuid);
  }

  @Put('visit-places/:uuid')
  @ApiOperation({ summary: 'Update a visit place (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateVisitPlace(@Param('uuid') uuid: string, @Body() dto: UpdateCrmVisitPlaceDto) {
    return this.masterService.updateVisitPlace(uuid, dto);
  }

  @Patch('visit-places/:uuid')
  @ApiOperation({ summary: 'Update a visit place (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchVisitPlace(@Param('uuid') uuid: string, @Body() dto: UpdateCrmVisitPlaceDto) {
    return this.masterService.updateVisitPlace(uuid, dto);
  }

  @Delete('visit-places/:uuid')
  @ApiOperation({ summary: 'Delete a visit place' })
  @ApiParam({ name: 'uuid' })
  async deleteVisitPlace(@Param('uuid') uuid: string) {
    return this.masterService.deleteVisitPlace(uuid);
  }

  // ----------------------------------------------------
  // Visit Statuses
  // ----------------------------------------------------
  @Post('visit-statuses')
  @ApiOperation({ summary: 'Create a visit status' })
  @ApiBody({ type: CreateCrmVisitStatusDto })
  async createVisitStatus(@Body() dto: CreateCrmVisitStatusDto) {
    return this.masterService.createVisitStatus(dto);
  }

  @Get('visit-statuses')
  @ApiOperation({ summary: 'Get all visit statuses' })
  async getVisitStatuses() {
    return this.masterService.findAllVisitStatuses();
  }

  @Get('visit-statuses/:uuid')
  @ApiOperation({ summary: 'Get a visit status by UUID' })
  @ApiParam({ name: 'uuid' })
  async getVisitStatusByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findVisitStatusByUuid(uuid);
  }

  @Put('visit-statuses/:uuid')
  @ApiOperation({ summary: 'Update a visit status (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateVisitStatus(@Param('uuid') uuid: string, @Body() dto: UpdateCrmVisitStatusDto) {
    return this.masterService.updateVisitStatus(uuid, dto);
  }

  @Patch('visit-statuses/:uuid')
  @ApiOperation({ summary: 'Update a visit status (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchVisitStatus(@Param('uuid') uuid: string, @Body() dto: UpdateCrmVisitStatusDto) {
    return this.masterService.updateVisitStatus(uuid, dto);
  }

  @Delete('visit-statuses/:uuid')
  @ApiOperation({ summary: 'Delete a visit status' })
  @ApiParam({ name: 'uuid' })
  async deleteVisitStatus(@Param('uuid') uuid: string) {
    return this.masterService.deleteVisitStatus(uuid);
  }

  // ----------------------------------------------------
  // Task Types
  // ----------------------------------------------------
  @Post('task-types')
  @ApiOperation({ summary: 'Create a task type' })
  @ApiBody({ type: CreateCrmTaskTypeDto })
  async createTaskType(@Body() dto: CreateCrmTaskTypeDto) {
    return this.masterService.createTaskType(dto);
  }

  @Get('task-types')
  @ApiOperation({ summary: 'Get all task types' })
  async getTaskTypes() {
    return this.masterService.findAllTaskTypes();
  }

  @Get('task-types/:uuid')
  @ApiOperation({ summary: 'Get a task type by UUID' })
  @ApiParam({ name: 'uuid' })
  async getTaskTypeByUuid(@Param('uuid') uuid: string) {
    return this.masterService.findTaskTypeByUuid(uuid);
  }

  @Put('task-types/:uuid')
  @ApiOperation({ summary: 'Update a task type (PUT)' })
  @ApiParam({ name: 'uuid' })
  async updateTaskType(@Param('uuid') uuid: string, @Body() dto: UpdateCrmTaskTypeDto) {
    return this.masterService.updateTaskType(uuid, dto);
  }

  @Patch('task-types/:uuid')
  @ApiOperation({ summary: 'Update a task type (PATCH)' })
  @ApiParam({ name: 'uuid' })
  async patchTaskType(@Param('uuid') uuid: string, @Body() dto: UpdateCrmTaskTypeDto) {
    return this.masterService.updateTaskType(uuid, dto);
  }

  @Delete('task-types/:uuid')
  @ApiOperation({ summary: 'Delete a task type' })
  @ApiParam({ name: 'uuid' })
  async deleteTaskType(@Param('uuid') uuid: string) {
    return this.masterService.deleteTaskType(uuid);
  }
}
