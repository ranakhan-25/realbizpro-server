import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmLeadCategoryAttributes, CrmLeadCategoryCreationAttributes } from '../../types/crmleadcategory.types';

@Table({
  tableName: 'crm_lead_categories',
  timestamps: true,
  paranoid: true,
})
export class CrmLeadCategory extends BaseModel<CrmLeadCategoryAttributes, CrmLeadCategoryCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  code?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

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

  @HasMany(() => CrmLead, { foreignKey: 'lead_category_id' })
  leads: CrmLead[];
}
