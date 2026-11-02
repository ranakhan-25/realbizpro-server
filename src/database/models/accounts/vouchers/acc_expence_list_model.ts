/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ExpenseItem } from './acc_expense-item.model';


export interface ExpenseAttributes {
  uuid?: string;
  projectType?: string;
  project?: string;
  titleOfWork?: string;
  task?: string;
  site?: string;
  date: Date;
  voucherNo: string;
  contact?: string;
  cashOrBank?: string;
  chequeNo?: string;
  comment?: string;
  attachmentUrl?: string;
  totalAmount: number;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ExpenseCreationAttributes extends Omit<ExpenseAttributes, 'uuid'> {}
export interface ExpenseUpdateAttributes extends Partial<ExpenseAttributes> {}

@Table({
  tableName: 'expense',
  timestamps: true,
  paranoid: true,
  underscored: true, // ✅ snake_case ডাটাবেসের জন্য
})
export class Expense
  extends BaseModel<ExpenseUpdateAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_type' })
  declare projectType?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare project?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'title_of_work' })
  declare titleOfWork?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare task?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare site?: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: Date;

  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'voucher_no' })
  declare voucherNo: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare contact?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'cash_or_bank' })
  declare cashOrBank?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'cheque_no' })
  declare chequeNo?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'attachment_url' })
  declare attachmentUrl?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'total_amount' })
  declare totalAmount: number;

  @Column({ type: DataType.STRING, allowNull: true, field: 'added_by' })
  declare addedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'added_by_id' })
  declare addedById?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  // ✅ HasMany রিলেশন: একটি ভাউচারের অধীনে একাধিক TXN
  @HasMany(() => ExpenseItem, {
    foreignKey: 'expenseUuid',
    sourceKey: 'uuid',
    as: 'items',
  })
  declare items: ExpenseItem[];
}