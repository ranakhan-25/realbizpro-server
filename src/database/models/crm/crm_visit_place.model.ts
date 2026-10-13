import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { CrmVisitPlaceAttributes, CrmVisitPlaceCreationAttributes } from '../../types/crmvisitplace.types';

@Table({
  tableName: 'crm_visit_places',
  timestamps: true,
  paranoid: true,
})
export class CrmVisitPlace extends BaseModel<CrmVisitPlaceAttributes, CrmVisitPlaceCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  contact_person?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  contact_number?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;
}
