/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';

export interface PayableReportAttributes {
  uuid?: string;
  supplierName: string;
  openingBalance: number;
  debit: number;
  credit: number;
  balance: number;
  project?: string;
  company?: string;
  contactType?: string;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface PayableReportCreationAttributes extends Omit<PayableReportAttributes, 'uuid'> {}
export interface PayableReportUpdateAttributes extends Partial<PayableReportAttributes> {}

@Table({
  tableName: 'payable_report',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class PayableReport
  extends BaseModel<PayableReportUpdateAttributes, PayableReportCreationAttributes>
  implements PayableReportAttributes
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
  })
  declare supplierName: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare openingBalance: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare debit: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare credit: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare balance: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare project?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare company?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare contactType?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedById?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string;
}