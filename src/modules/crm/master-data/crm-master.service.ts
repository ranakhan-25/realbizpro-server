import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrmLeadCategory } from '../../../database/models/crm/crm_lead_category.model';
import { CrmLeadStage } from '../../../database/models/crm/crm_lead_stage.model';
import { CrmLeadSource } from '../../../database/models/crm/crm_lead_source.model';
import { CrmCampaign } from '../../../database/models/crm/crm_campaign.model';
import { CrmProfession } from '../../../database/models/crm/crm_profession.model';
import { CrmTeam } from '../../../database/models/crm/crm_team.model';
import { CrmTeamMember } from '../../../database/models/crm/crm_team_member.model';
import { CrmArea } from '../../../database/models/crm/crm_area.model';
import { CrmFeature } from '../../../database/models/crm/crm_feature.model';
import { CrmPriceRange } from '../../../database/models/crm/crm_price_range.model';
import { CrmRequirementType } from '../../../database/models/crm/crm_requirement_type.model';
import { CrmVisitPlace } from '../../../database/models/crm/crm_visit_place.model';
import { CrmVisitStatus } from '../../../database/models/crm/crm_visit_status.model';
import { CrmTaskType } from '../../../database/models/crm/crm_task_type.model';
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

@Injectable()
export class CrmMasterService {
  constructor(
    @InjectModel(CrmLeadCategory)
    private readonly categoryModel: typeof CrmLeadCategory,
    @InjectModel(CrmLeadStage)
    private readonly stageModel: typeof CrmLeadStage,
    @InjectModel(CrmLeadSource)
    private readonly sourceModel: typeof CrmLeadSource,
    @InjectModel(CrmCampaign)
    private readonly campaignModel: typeof CrmCampaign,
    @InjectModel(CrmProfession)
    private readonly professionModel: typeof CrmProfession,
    @InjectModel(CrmTeam)
    private readonly teamModel: typeof CrmTeam,
    @InjectModel(CrmTeamMember)
    private readonly teamMemberModel: typeof CrmTeamMember,
    @InjectModel(CrmArea)
    private readonly areaModel: typeof CrmArea,
    @InjectModel(CrmFeature)
    private readonly featureModel: typeof CrmFeature,
    @InjectModel(CrmPriceRange)
    private readonly priceRangeModel: typeof CrmPriceRange,
    @InjectModel(CrmRequirementType)
    private readonly requirementTypeModel: typeof CrmRequirementType,
    @InjectModel(CrmVisitPlace)
    private readonly visitPlaceModel: typeof CrmVisitPlace,
    @InjectModel(CrmVisitStatus)
    private readonly visitStatusModel: typeof CrmVisitStatus,
    @InjectModel(CrmTaskType)
    private readonly taskTypeModel: typeof CrmTaskType,
  ) {}

  // Categories
  async createCategory(dto: CreateCrmCategoryDto) {
    return await this.categoryModel.create(dto as any);
  }
  async findAllCategories() {
    return await this.categoryModel.findAll({ order: [['createdAt', 'DESC']] });
  }
  async findCategoryByUuid(uuid: string) {
    const item = await this.categoryModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Category not found');
    return item;
  }
  async updateCategory(uuid: string, dto: UpdateCrmCategoryDto) {
    const item = await this.findCategoryByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteCategory(uuid: string) {
    const item = await this.findCategoryByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Category deleted' };
  }

  // Stages
  async createStage(dto: CreateCrmStageDto) {
    return await this.stageModel.create(dto as any);
  }
  async findAllStages() {
    return await this.stageModel.findAll({ order: [['order', 'ASC']] });
  }
  async findStageByUuid(uuid: string) {
    const item = await this.stageModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Stage not found');
    return item;
  }
  async updateStage(uuid: string, dto: UpdateCrmStageDto) {
    const item = await this.findStageByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteStage(uuid: string) {
    const item = await this.findStageByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Stage deleted' };
  }

  // Sources
  async createSource(dto: CreateCrmSourceDto) {
    return await this.sourceModel.create(dto as any);
  }
  async findAllSources() {
    return await this.sourceModel.findAll({ order: [['createdAt', 'DESC']] });
  }
  async findSourceByUuid(uuid: string) {
    const item = await this.sourceModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Source not found');
    return item;
  }
  async updateSource(uuid: string, dto: UpdateCrmSourceDto) {
    const item = await this.findSourceByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteSource(uuid: string) {
    const item = await this.findSourceByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Source deleted' };
  }

  // Campaigns
  async createCampaign(dto: CreateCrmCampaignDto) {
    return await this.campaignModel.create(dto as any);
  }
  async findAllCampaigns() {
    return await this.campaignModel.findAll({ order: [['createdAt', 'DESC']] });
  }
  async findCampaignByUuid(uuid: string) {
    const item = await this.campaignModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Campaign not found');
    return item;
  }
  async updateCampaign(uuid: string, dto: UpdateCrmCampaignDto) {
    const item = await this.findCampaignByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteCampaign(uuid: string) {
    const item = await this.findCampaignByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Campaign deleted' };
  }

  // Professions
  async createProfession(dto: CreateCrmProfessionDto) {
    return await this.professionModel.create(dto as any);
  }
  async findAllProfessions() {
    return await this.professionModel.findAll({ order: [['name', 'ASC']] });
  }
  async findProfessionByUuid(uuid: string) {
    const item = await this.professionModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Profession not found');
    return item;
  }
  async updateProfession(uuid: string, dto: UpdateCrmProfessionDto) {
    const item = await this.findProfessionByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteProfession(uuid: string) {
    const item = await this.findProfessionByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Profession deleted' };
  }

  // Teams & Team Members
  async createTeam(dto: CreateCrmTeamDto) {
    return await this.teamModel.create(dto as any);
  }
  async findAllTeams() {
    return await this.teamModel.findAll({
      include: [{ model: this.teamMemberModel, as: 'members' }],
      order: [['createdAt', 'DESC']],
    });
  }
  async findTeamByUuid(uuid: string) {
    const item = await this.teamModel.findOne({
      where: { uuid },
      include: [{ model: this.teamMemberModel, as: 'members' }],
    });
    if (!item) throw new NotFoundException('Team not found');
    return item;
  }
  async updateTeam(uuid: string, dto: UpdateCrmTeamDto) {
    const item = await this.findTeamByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteTeam(uuid: string) {
    const item = await this.findTeamByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Team deleted' };
  }
  async addTeamMember(teamUuid: string, memberData: { user_id: string; role_in_team?: string }) {
    const team = await this.findTeamByUuid(teamUuid);
    return await this.teamMemberModel.create({
      team_id: team.id,
      user_id: memberData.user_id,
      role_in_team: memberData.role_in_team,
      is_active: true,
    } as any);
  }

  // Areas
  async createArea(dto: CreateCrmAreaDto) {
    return await this.areaModel.create(dto as any);
  }
  async findAllAreas() {
    return await this.areaModel.findAll({ order: [['name', 'ASC']] });
  }
  async findAreaByUuid(uuid: string) {
    const item = await this.areaModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Area not found');
    return item;
  }
  async updateArea(uuid: string, dto: UpdateCrmAreaDto) {
    const item = await this.findAreaByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteArea(uuid: string) {
    const item = await this.findAreaByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Area deleted' };
  }

  // Features
  async createFeature(dto: CreateCrmFeatureDto) {
    return await this.featureModel.create(dto as any);
  }
  async findAllFeatures() {
    return await this.featureModel.findAll({ order: [['name', 'ASC']] });
  }
  async findFeatureByUuid(uuid: string) {
    const item = await this.featureModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Feature not found');
    return item;
  }
  async updateFeature(uuid: string, dto: UpdateCrmFeatureDto) {
    const item = await this.findFeatureByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteFeature(uuid: string) {
    const item = await this.findFeatureByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Feature deleted' };
  }

  // Price Ranges
  async createPriceRange(dto: CreateCrmPriceRangeDto) {
    return await this.priceRangeModel.create(dto as any);
  }
  async findAllPriceRanges() {
    return await this.priceRangeModel.findAll({ order: [['createdAt', 'DESC']] });
  }
  async findPriceRangeByUuid(uuid: string) {
    const item = await this.priceRangeModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Price range not found');
    return item;
  }
  async updatePriceRange(uuid: string, dto: UpdateCrmPriceRangeDto) {
    const item = await this.findPriceRangeByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deletePriceRange(uuid: string) {
    const item = await this.findPriceRangeByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Price range deleted' };
  }

  // Requirement Types
  async createRequirementType(dto: CreateCrmRequirementTypeDto) {
    return await this.requirementTypeModel.create(dto as any);
  }
  async findAllRequirementTypes() {
    return await this.requirementTypeModel.findAll({ order: [['name', 'ASC']] });
  }
  async findRequirementTypeByUuid(uuid: string) {
    const item = await this.requirementTypeModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Requirement type not found');
    return item;
  }
  async updateRequirementType(uuid: string, dto: UpdateCrmRequirementTypeDto) {
    const item = await this.findRequirementTypeByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteRequirementType(uuid: string) {
    const item = await this.findRequirementTypeByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Requirement type deleted' };
  }

  // Visit Places
  async createVisitPlace(dto: CreateCrmVisitPlaceDto) {
    return await this.visitPlaceModel.create(dto as any);
  }
  async findAllVisitPlaces() {
    return await this.visitPlaceModel.findAll({ order: [['name', 'ASC']] });
  }
  async findVisitPlaceByUuid(uuid: string) {
    const item = await this.visitPlaceModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Visit place not found');
    return item;
  }
  async updateVisitPlace(uuid: string, dto: UpdateCrmVisitPlaceDto) {
    const item = await this.findVisitPlaceByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteVisitPlace(uuid: string) {
    const item = await this.findVisitPlaceByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Visit place deleted' };
  }

  // Visit Statuses
  async createVisitStatus(dto: CreateCrmVisitStatusDto) {
    return await this.visitStatusModel.create(dto as any);
  }
  async findAllVisitStatuses() {
    return await this.visitStatusModel.findAll({ order: [['createdAt', 'ASC']] });
  }
  async findVisitStatusByUuid(uuid: string) {
    const item = await this.visitStatusModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Visit status not found');
    return item;
  }
  async updateVisitStatus(uuid: string, dto: UpdateCrmVisitStatusDto) {
    const item = await this.findVisitStatusByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteVisitStatus(uuid: string) {
    const item = await this.findVisitStatusByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Visit status deleted' };
  }

  // Task Types
  async createTaskType(dto: CreateCrmTaskTypeDto) {
    return await this.taskTypeModel.create(dto as any);
  }
  async findAllTaskTypes() {
    return await this.taskTypeModel.findAll({ order: [['name', 'ASC']] });
  }
  async findTaskTypeByUuid(uuid: string) {
    const item = await this.taskTypeModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Task type not found');
    return item;
  }
  async updateTaskType(uuid: string, dto: UpdateCrmTaskTypeDto) {
    const item = await this.findTaskTypeByUuid(uuid);
    await item.update(dto as any);
    return item;
  }
  async deleteTaskType(uuid: string) {
    const item = await this.findTaskTypeByUuid(uuid);
    await item.destroy();
    return { success: true, message: 'Task type deleted' };
  }
}
