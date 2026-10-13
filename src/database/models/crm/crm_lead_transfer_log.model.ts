import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmLeadTransferLogAttributes, CrmLeadTransferLogCreationAttributes } from '../../types/crmleadtransferlog.types';

@Table({
  tableName: 'crm_lead_transfer_logs',
  timestamps: true,
  paranoid: true,
})
export class CrmLeadTransferLog extends BaseModel<CrmLeadTransferLogAttributes, CrmLeadTransferLogCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  lead_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  transferred_from: string;

  @Column({ type: DataType.STRING, allowNull: false })
  transferred_to: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  transfer_reason?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  transfer_date: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  approved_by?: string;

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
