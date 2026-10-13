import { Column, DataType, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLeadCategory } from './crm_lead_category.model';
import { CrmLeadStage } from './crm_lead_stage.model';
import { CrmLeadSource } from './crm_lead_source.model';
import { CrmCampaign } from './crm_campaign.model';
import { CrmProfession } from './crm_profession.model';
import { CrmLeadRequirement } from './crm_lead_requirement.model';
import { CrmLeadPropertyInterest } from './crm_lead_property_interest.model';
import { CrmLeadActivity } from './crm_lead_activity.model';
import { CrmLeadAttachment } from './crm_lead_attachment.model';
import { CrmLeadCallAssign } from './crm_lead_call_assign.model';
import { CrmLeadTransferLog } from './crm_lead_transfer_log.model';
import { CrmDealNegotiation } from './crm_deal_negotiation.model';

import type { CrmLeadAttributes, CrmLeadCreationAttributes } from '../../types/crmlead.types';

@Table({
  tableName: 'crm_leads',
  timestamps: true,
  paranoid: true,
})
export class CrmLead extends BaseModel<CrmLeadAttributes, CrmLeadCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  lead_code: string;

  @Column({ type: DataType.STRING, allowNull: false })
  client_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: true })
  alternate_phone?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  email?: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  lead_category_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  lead_stage_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  lead_source_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  campaign_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  profession_id?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  designation?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  organization?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  present_address?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  permanent_address?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  assigned_to?: string;

  @Column({ type: DataType.STRING, defaultValue: 'medium' })
  priority: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  lead_score: number;

  @Column({ type: DataType.STRING, defaultValue: 'active' })
  status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @BelongsTo(() => CrmLeadCategory, { foreignKey: 'lead_category_id' })
  category: CrmLeadCategory;

  @BelongsTo(() => CrmLeadStage, { foreignKey: 'lead_stage_id' })
  stage: CrmLeadStage;

  @BelongsTo(() => CrmLeadSource, { foreignKey: 'lead_source_id' })
  source: CrmLeadSource;

  @BelongsTo(() => CrmCampaign, { foreignKey: 'campaign_id' })
  campaign: CrmCampaign;

  @BelongsTo(() => CrmProfession, { foreignKey: 'profession_id' })
  profession: CrmProfession;

  @HasMany(() => CrmLeadRequirement, { foreignKey: 'lead_id' })
  requirements: CrmLeadRequirement[];

  @HasMany(() => CrmLeadPropertyInterest, { foreignKey: 'lead_id' })
  property_interests: CrmLeadPropertyInterest[];

  @HasMany(() => CrmLeadActivity, { foreignKey: 'lead_id' })
  activities: CrmLeadActivity[];

  @HasMany(() => CrmLeadAttachment, { foreignKey: 'lead_id' })
  attachments: CrmLeadAttachment[];

  @HasMany(() => CrmLeadCallAssign, { foreignKey: 'lead_id' })
  call_assignments: CrmLeadCallAssign[];

  @HasMany(() => CrmLeadTransferLog, { foreignKey: 'lead_id' })
  transfer_logs: CrmLeadTransferLog[];

  @HasMany(() => CrmDealNegotiation, { foreignKey: 'lead_id' })
  negotiations: CrmDealNegotiation[];
}
