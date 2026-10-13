import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { CrmVisitStatusAttributes, CrmVisitStatusCreationAttributes } from '../../types/crmvisitstatus.types';

@Table({
  tableName: 'crm_visit_statuses',
  timestamps: true,
  paranoid: true,
})
export class CrmVisitStatus extends BaseModel<CrmVisitStatusAttributes, CrmVisitStatusCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  color?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;
}
