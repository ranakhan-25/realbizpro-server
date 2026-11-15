import { Column, DataType, Table, Index, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvPurchase } from './inv_purchase.model';

import type { InvSupplierAttributes, InvSupplierCreationAttributes } from '../../types/invsupplier.types';

@Table({
  tableName: 'inv_suppliers',
  timestamps: true,
  paranoid: true,
})
export class InvSupplier extends BaseModel<InvSupplierAttributes, InvSupplierCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  code: string;

  @Index({ name: 'idx_inv_supplier_name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  company?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  email?: string;

  @Index({ name: 'idx_inv_supplier_mobile' })
  @Column({ type: DataType.STRING, allowNull: false })
  mobile: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  address?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  credit_limit: number;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  due_date?: Date;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  opening_balance: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  chart_of_group_id?: number;

  @HasMany(() => InvPurchase, { foreignKey: 'supplier_id', as: 'purchases' })
  declare purchases?: InvPurchase[];

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Index({ name: 'idx_inv_supplier_org_id' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare org_id: string;
}
