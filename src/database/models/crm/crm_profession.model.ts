import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmProfessionAttributes, CrmProfessionCreationAttributes } from '../../types/crmprofession.types';

@Table({
  tableName: 'crm_professions',
  timestamps: true,
  paranoid: true,
})
export class CrmProfession extends BaseModel<CrmProfessionAttributes, CrmProfessionCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @HasMany(() => CrmLead, { foreignKey: 'profession_id' })
  leads: CrmLead[];
}
