import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmLeadRequirementAttributes, CrmLeadRequirementCreationAttributes } from '../../types/crmleadrequirement.types';

@Table({
  tableName: 'crm_lead_requirements',
  timestamps: true,
  paranoid: true,
})
export class CrmLeadRequirement extends BaseModel<CrmLeadRequirementAttributes, CrmLeadRequirementCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  lead_id: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  requirement_type_id?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  property_type?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  preferred_area?: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
  size_sqft?: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  budget_min?: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  budget_max?: number;

  @Column({ type: DataType.JSON, allowNull: true })
  features_required?: any;

  @Column({ type: DataType.TEXT, allowNull: true })
  remarks?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @BelongsTo(() => CrmLead, { foreignKey: 'lead_id' })
  lead: CrmLead;
}
