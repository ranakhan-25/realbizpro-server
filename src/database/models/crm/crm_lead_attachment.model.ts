import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmLeadAttachmentAttributes, CrmLeadAttachmentCreationAttributes } from '../../types/crmleadattachment.types';

@Table({
  tableName: 'crm_lead_attachments',
  timestamps: true,
  paranoid: true,
})
export class CrmLeadAttachment extends BaseModel<CrmLeadAttachmentAttributes, CrmLeadAttachmentCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  lead_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  file_url: string;

  @Column({ type: DataType.STRING, allowNull: true })
  file_type?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  file_size?: number;

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
