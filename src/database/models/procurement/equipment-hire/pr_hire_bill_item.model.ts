import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementHireBill } from './pr_hire_bill.model';
import { ProcurementHireOrderItem } from './pr_hire_order_item.model';
import type { ProcurementHireBillItemAttributes, ProcurementHireBillItemCreationAttributes } from '../../../types/procurementhirebillitem.types';

@Table({
  tableName: 'pr_hire_bill_items',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProcurementHireBillItem extends BaseModel<ProcurementHireBillItemAttributes, ProcurementHireBillItemCreationAttributes> {
  @ForeignKey(() => ProcurementHireBill)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare bill_id: string;
  @BelongsTo(() => ProcurementHireBill, {
    foreignKey: 'bill_id',
    targetKey: 'uuid',
    as: 'bill',
    onDelete: 'CASCADE',
  })
  declare bill?: ProcurementHireBill;
  @ForeignKey(() => ProcurementHireOrderItem)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare hire_order_item_id: string;
  @BelongsTo(() => ProcurementHireOrderItem, {
    foreignKey: 'hire_order_item_id',
    targetKey: 'uuid',
    as: 'hireOrderItem',
  })
  declare hireOrderItem?: ProcurementHireOrderItem;
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare description: string;
  @Column({
    type: DataType.DECIMAL(15, 3),
    allowNull: false,
  })
  declare quantity: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  declare rate: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare tax_amount: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare vat_amount: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  declare amount: number;
}
