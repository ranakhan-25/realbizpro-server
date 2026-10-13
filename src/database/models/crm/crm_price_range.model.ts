import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { CrmPriceRangeAttributes, CrmPriceRangeCreationAttributes } from '../../types/crmpricerange.types';

@Table({
  tableName: 'crm_price_ranges',
  timestamps: true,
  paranoid: true,
})
export class CrmPriceRange extends BaseModel<CrmPriceRangeAttributes, CrmPriceRangeCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  min_price?: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  max_price?: number;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;
}
