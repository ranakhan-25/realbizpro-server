import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { CrmTaskTypeAttributes, CrmTaskTypeCreationAttributes } from '../../types/crmtasktype.types';

@Table({
  tableName: 'crm_task_types',
  timestamps: true,
  paranoid: true,
})
export class CrmTaskType extends BaseModel<CrmTaskTypeAttributes, CrmTaskTypeCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  code?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;
}
