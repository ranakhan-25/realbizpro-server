import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { LeadRequirementType } from './crm-lead-master-data.model';
import { Lead } from './crm-lead.model';

import type { LeadRequirementAttributes, LeadRequirementCreationAttributes } from '../../../types/leadrequirement.types';

@Table({ tableName: 'crm_lead_requirements', timestamps: true, paranoid: true, underscored: true })
export class LeadRequirement extends BaseModel<LeadRequirementAttributes, LeadRequirementCreationAttributes> {
  @ForeignKey(() => Lead)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'lead_id' }) declare leadId: number;
  @ForeignKey(() => LeadRequirementType)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'requirement_type_id' }) declare requirementTypeId?: number;
  @Column({ type: DataType.STRING(100), allowNull: true, field: 'property_type' }) declare propertyType?: string;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'preferred_area' }) declare preferredArea?: string;
  @Column({ type: DataType.DECIMAL(12, 2), allowNull: true, field: 'size_sqft' }) declare sizeSqft?: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, field: 'budget_min' }) declare budgetMin?: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, field: 'budget_max' }) declare budgetMax?: number;
  @Column({ type: DataType.JSON, allowNull: true, field: 'features_required' }) declare featuresRequired?: unknown;
  @Column({ type: DataType.TEXT, allowNull: true }) declare remarks?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' }) declare projectId?: string;
  @BelongsTo(() => Lead, { foreignKey: 'leadId', targetKey: 'id', as: 'lead' }) declare lead?: Lead;
  @BelongsTo(() => LeadRequirementType, { foreignKey: 'requirementTypeId', targetKey: 'id', as: 'requirementType' }) declare requirementType?: LeadRequirementType;
}
