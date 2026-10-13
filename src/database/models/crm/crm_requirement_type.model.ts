import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { CrmRequirementTypeAttributes, CrmRequirementTypeCreationAttributes } from '../../types/crmrequirementtype.types';

@Table({
  tableName: 'crm_requirement_types',
  timestamps: true,
  paranoid: true,
})
export class CrmRequirementType extends BaseModel<CrmRequirementTypeAttributes, CrmRequirementTypeCreationAttributes> {
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
