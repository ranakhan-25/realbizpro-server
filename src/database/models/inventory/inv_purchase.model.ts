import { Column, DataType, Table, Index, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvPurchaseItem } from './inv_purchase_item.model';

import type { InvPurchaseAttributes, InvPurchaseCreationAttributes } from '../../types/invpurchase.types';

@Table({
  tableName: 'inv_purchases',
  timestamps: true,
  paranoid: true,
})
export class InvPurchase extends BaseModel<InvPurchaseAttributes, InvPurchaseCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_inv_purchase_date' })
  @Column({ type: DataType.DATEONLY, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  payment_method?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  subtotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  discount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  delivery_charge: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  grand_total: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  paid_amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  due_amount: number;

  @Column({ type: DataType.STRING, allowNull: true })
  cheque_no?: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  cheque_date?: Date;

  @Column({ type: DataType.UUID, allowNull: false })
  supplier_id: string;

  @Column({ type: DataType.UUID, allowNull: true })
  project_type_id?: string;

  @Index({ name: 'idx_inv_purchase_project' })
  @Column({ type: DataType.UUID, allowNull: true })
  project_id?: string;

  @Column({ type: DataType.UUID, allowNull: true })
  boq_title_id?: string;

  @Column({ type: DataType.UUID, allowNull: true })
  task_id?: string;

  @Column({ type: DataType.UUID, allowNull: true })
  site_id?: string;

  @HasMany(() => InvPurchaseItem, { foreignKey: 'purchase_id', sourceKey: 'id', onDelete: 'CASCADE' })
  items?: InvPurchaseItem[];

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
