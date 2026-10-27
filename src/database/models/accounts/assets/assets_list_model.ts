/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';

export enum DepreciationMethod {
  STRAIGHT_LINE = 'Straight Line',
  REDUCING_BALANCE = 'Reducing Balance',
}

export enum ComputationType {
  DAILY = 'Daily',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export enum AssetStatus {
  RUNNING = 'Running',
  DISPOSED = 'Disposed',
  SOLD = 'Sold',
}

export interface AssetAttributes {
  uuid?: string;
  itemName: string;
  location: string;
  acquisitionDate: Date;
  originalValue: number;
  notDepreciableValue: number;
  bookValue: number;
  depreciableValue: number;
  method: DepreciationMethod;
  duration: number;
  computation: ComputationType;
  project?: string;
  expenseAccount?: string;
  voucherNo?: string;
  status: AssetStatus;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface AssetCreationAttributes extends Omit<AssetAttributes, 'uuid'> {}
export interface AssetUpdateAttributes extends Partial<AssetAttributes> {}

@Table({
  tableName: 'asset',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Asset
  extends BaseModel<AssetUpdateAttributes, AssetCreationAttributes>
  implements AssetAttributes
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
  declare itemName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'Head Office',
  })
  declare location: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare acquisitionDate: Date;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare originalValue: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare notDepreciableValue: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare bookValue: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare depreciableValue: number;

  @Column({
    type: DataType.ENUM(...Object.values(DepreciationMethod)),
    allowNull: false,
    defaultValue: DepreciationMethod.STRAIGHT_LINE,
  })
  declare method: DepreciationMethod;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare duration: number;

  @Column({
    type: DataType.ENUM(...Object.values(ComputationType)),
    allowNull: false,
    defaultValue: ComputationType.YEARLY,
  })
  declare computation: ComputationType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare project?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare expenseAccount?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare voucherNo?: string;

  @Column({
    type: DataType.ENUM(...Object.values(AssetStatus)),
    allowNull: false,
    defaultValue: AssetStatus.RUNNING,
  })
  declare status: AssetStatus;

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