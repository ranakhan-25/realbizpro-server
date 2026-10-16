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

  // Features
  async createFeature(dto: CreateCrmFeatureDto) {
    return await this.featureModel.create(dto as any);
  }
  async findAllFeatures() {
    return await this.featureModel.findAll({ order: [['name', 'ASC']] });
  }
}
