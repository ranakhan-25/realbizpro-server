import { Column, DataType, Table, Index } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { InvWarehouseAttributes, InvWarehouseCreationAttributes } from '../../types/invwarehouse.types';

@Table({
  tableName: 'inv_warehouses',
  timestamps: true,
  paranoid: true,
})
export class InvWarehouse extends BaseModel<InvWarehouseAttributes, InvWarehouseCreationAttributes> {
  @Index({ name: 'idx_warehouse_code' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  code: string;

  @Index({ name: 'idx_warehouse_name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  location?: string;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'central' })
  type: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  is_active: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  declare org_id?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
