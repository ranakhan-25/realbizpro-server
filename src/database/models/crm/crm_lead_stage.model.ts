import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmLeadStageAttributes, CrmLeadStageCreationAttributes } from '../../types/crmleadstage.types';

@Table({
  tableName: 'crm_lead_stages',
  timestamps: true,
  paranoid: true,
})
export class CrmLeadStage extends BaseModel<CrmLeadStageAttributes, CrmLeadStageCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  order: number;

  @Column({ type: DataType.STRING, allowNull: true })
  color?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_system: boolean;

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

  @HasMany(() => CrmLead, { foreignKey: 'lead_stage_id' })
  leads: CrmLead[];
}
