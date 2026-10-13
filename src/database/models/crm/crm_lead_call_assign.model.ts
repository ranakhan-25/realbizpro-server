import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmLeadCallAssignAttributes, CrmLeadCallAssignCreationAttributes } from '../../types/crmleadcallassign.types';

@Table({
  tableName: 'crm_lead_call_assigns',
  timestamps: true,
  paranoid: true,
})
export class CrmLeadCallAssign extends BaseModel<CrmLeadCallAssignAttributes, CrmLeadCallAssignCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  lead_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  assigned_from: string;

  @Column({ type: DataType.STRING, allowNull: false })
  assigned_to: string;

  @Column({ type: DataType.DATE, allowNull: false })
  assignment_date: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  due_date?: Date;

  @Column({ type: DataType.STRING, defaultValue: 'medium' })
  priority: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  instruction?: string;

  @Column({ type: DataType.STRING, defaultValue: 'pending' })
  status: string;

  @Column({ type: DataType.DATE, allowNull: true })
  completed_at?: Date;

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
