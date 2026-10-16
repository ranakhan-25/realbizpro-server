import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmLeadActivityAttributes, CrmLeadActivityCreationAttributes } from '../../types/crmleadactivity.types';

@Table({
  tableName: 'crm_lead_activities',
  timestamps: true,
  paranoid: true,
})
export class CrmLeadActivity extends BaseModel<CrmLeadActivityAttributes, CrmLeadActivityCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  lead_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  activity_type: string;

  @Column({ type: DataType.DATE, allowNull: false })
  activity_date: Date;

  @Column({ type: DataType.TEXT, allowNull: false })
  summary: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  discussion_points?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  next_followup_date?: Date;

  @Column({ type: DataType.BIGINT, allowNull: true })
  visit_place_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  visit_status_id?: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  feedback?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  conducted_by?: string;

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
