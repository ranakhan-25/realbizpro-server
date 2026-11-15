import { Column, DataType, Table, Index } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { InvStockCountAttributes, InvStockCountCreationAttributes } from '../../types/invstockcount.types';

@Table({
  tableName: 'inv_stock_counts',
  timestamps: true,
  paranoid: true,
})
export class InvStockCount extends BaseModel<InvStockCountAttributes, InvStockCountCreationAttributes> {
  @Index({ name: 'idx_stock_count_warehouse_id' })
  @Column({ type: DataType.BIGINT, allowNull: true })
  warehouse_id?: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, defaultValue: DataType.NOW })
  counted_at: Date;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'draft' })
  status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  note?: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  lines_json?: any;

  @Index({ name: 'idx_stock_count_org_id' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare org_id: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
