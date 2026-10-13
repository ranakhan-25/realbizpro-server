import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmLeadSourceAttributes, CrmLeadSourceCreationAttributes } from '../../types/crmleadsource.types';

@Table({
  tableName: 'crm_lead_sources',
  timestamps: true,
  paranoid: true,
})
export class CrmLeadSource extends BaseModel<CrmLeadSourceAttributes, CrmLeadSourceCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  code?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @HasMany(() => CrmLead, { foreignKey: 'lead_source_id' })
  leads: CrmLead[];
}
