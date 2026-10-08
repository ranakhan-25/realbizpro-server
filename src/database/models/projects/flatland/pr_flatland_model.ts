/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  FlatLandAttributes,
  FlatLandCreationAttributes,
  FlatLandUpdateAttributes,
} from 'src/database/types/flatland.types';

export enum FlatLandStatus {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
  SOLD = 'Sold',
}

@Table({
  tableName: 'flat_land',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class FlatLand
  extends BaseModel<
    FlatLandUpdateAttributes,
    FlatLandCreationAttributes
  >
  implements FlatLandAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare projectName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare siteBlock?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare flatLandNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare unit?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare bedroom?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare bathroom?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare size?: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare pricePerUnit?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare parkingCost?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare utilityCharge?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare customerName?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(FlatLandStatus).map((v) => String(v)),
    ),
    allowNull: false,
    defaultValue: FlatLandStatus.AVAILABLE,
  })
  declare status: FlatLandStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;
}