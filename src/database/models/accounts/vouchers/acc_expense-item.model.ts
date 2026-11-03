/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { Expense } from './acc_expence_list_model';


export interface ExpenseItemAttributes {
  uuid?: string;
  expenseUuid: string;
  accountId: string;
  amount: number;
  note?: string;
}

export interface ExpenseItemCreationAttributes extends Omit<ExpenseItemAttributes, 'uuid'> {}
export interface ExpenseItemUpdateAttributes extends Partial<ExpenseItemAttributes> {}

@Table({
  tableName: 'expense_item',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ExpenseItem
  extends BaseModel<ExpenseItemUpdateAttributes, ExpenseItemCreationAttributes>
  implements ExpenseItemAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @ForeignKey(() => Expense)
  @Column({ type: DataType.UUID, allowNull: false, field: 'expense_uuid' })
  declare expenseUuid: string;

  @BelongsTo(() => Expense, { foreignKey: 'expenseUuid', targetKey: 'uuid' })
  declare expense?: Expense;

  @Column({ type: DataType.STRING, allowNull: false, field: 'account_id' })
  declare accountId: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare amount: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare note?: string;
}