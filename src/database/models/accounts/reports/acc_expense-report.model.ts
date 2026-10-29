import type { ExpenseReportAttributes, ExpenseReportCreationAttributes } from '../../../types/expensereport.types';

/* eslint-disable prettier/prettier */

import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';

@Table({
  tableName: 'expense_report',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ExpenseReport extends BaseModel<ExpenseReportAttributes, ExpenseReportCreationAttributes> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  declare voucher: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare note?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare amount: number;

  @Column({ type: DataType.STRING, allowNull: true }) declare company?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare project?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare site?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare task?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare addedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare addedById?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deletedBy?: string;
}
