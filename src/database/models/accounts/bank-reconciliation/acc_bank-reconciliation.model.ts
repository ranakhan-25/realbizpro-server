/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';

export enum ReconciliationStatus {
  PENDING = 'Pending',
  HONOUR = 'Honour',
  DISHONOUR = 'DisHonour',
  HOLD = 'Hold',
}

export interface BankReconciliationAttributes {
  uuid?: string;
  voucherNo: string;
  description: string;
  bank: string;
  date: Date;
  chequeDate?: Date;
  amount: number;
  note?: string;
  status: ReconciliationStatus;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BankReconciliationCreationAttributes extends Omit<BankReconciliationAttributes, 'uuid'> {}
export interface BankReconciliationUpdateAttributes extends Partial<BankReconciliationAttributes> {}

@Table({
  tableName: 'bank_reconciliation',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class BankReconciliation
  extends BaseModel<BankReconciliationUpdateAttributes, BankReconciliationCreationAttributes>
  implements BankReconciliationAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'voucher_no',
  })
  declare voucherNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare bank: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'cheque_date',
  })
  declare chequeDate?: Date;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare amount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare note?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReconciliationStatus)),
    allowNull: false,
    defaultValue: ReconciliationStatus.PENDING,
  })
  declare status: ReconciliationStatus;

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
}