import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmLeadPropertyInterestAttributes, CrmLeadPropertyInterestCreationAttributes } from '../../types/crmleadpropertyinterest.types';

@Table({
  tableName: 'crm_lead_property_interests',
  timestamps: true,
  paranoid: true,
})
export class CrmLeadPropertyInterest extends BaseModel<CrmLeadPropertyInterestAttributes, CrmLeadPropertyInterestCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  lead_id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  project_name?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  plot_flat_no?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  size?: string;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  quoted_price?: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  client_offered_price?: number;

  @Column({ type: DataType.STRING, defaultValue: 'interested' })
  status: string;

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
