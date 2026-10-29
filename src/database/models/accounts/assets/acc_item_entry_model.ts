import type { ItemEntryAttributes, ItemEntryCreationAttributes } from '../../../types/itementry.types';

/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';

@Table({
  tableName: 'item_entry',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ItemEntry extends BaseModel<ItemEntryAttributes, ItemEntryCreationAttributes> {
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
    type: DataType.STRING,
    allowNull: true,
  })
  declare method: string;

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
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Running',
  })
  declare status: string;
}