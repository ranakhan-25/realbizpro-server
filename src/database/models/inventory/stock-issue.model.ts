import { Column, DataType, Table, Index } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { InvStockIssueAttributes, InvStockIssueCreationAttributes } from '../../types/invstockissue.types';

@Table({
  tableName: 'inv_stock_issues',
  timestamps: true,
  paranoid: true,
})
export class InvStockIssue extends BaseModel<InvStockIssueAttributes, InvStockIssueCreationAttributes> {
  @Index({ name: 'idx_stock_issue_code' })
  @Column({ type: DataType.STRING(50), allowNull: true })
  issue_code?: string;

  @Index({ name: 'idx_stock_issue_warehouse_id' })
  @Column({ type: DataType.BIGINT, allowNull: true })
  warehouse_id?: number;

  @Index({ name: 'idx_stock_issue_item_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  item_id: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  quantity: number;

  @Column({ type: DataType.STRING, allowNull: true })
  issued_to?: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  ref_type?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  ref_id?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  photo_url?: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, defaultValue: DataType.NOW })
  date: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare org_id?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
