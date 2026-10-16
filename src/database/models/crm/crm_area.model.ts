import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { CrmAreaAttributes, CrmAreaCreationAttributes } from '../../types/crmarea.types';

@Table({
  tableName: 'crm_areas',
  timestamps: true,
  paranoid: true,
})
export class CrmArea extends BaseModel<CrmAreaAttributes, CrmAreaCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  city?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  zone?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;
}
