/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  ProcurementUnitAttributes,
  ProcurementUnitCreationAttributes,
  ProcurementUnitUpdateAttributes,
} from 'src/database/types/procurementunit.types';
import { ProcurementItemEntry } from './pr_item_entry.model';
import { ProcurementAssetItemEntry } from '../asset/pr_asset_item_entry.model';

@Table({
  tableName: 'pr_unit',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProcurementUnit
  extends BaseModel<
    ProcurementUnitUpdateAttributes,
    ProcurementUnitCreationAttributes
  >
  implements ProcurementUnitAttributes
{
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @HasMany(() => ProcurementItemEntry, { foreignKey: 'unit_id', sourceKey: 'uuid', as: 'itemEntries' })
  declare itemEntries?: ProcurementItemEntry[];

  @HasMany(() => ProcurementAssetItemEntry, { foreignKey: 'unit_id', sourceKey: 'uuid', as: 'assetItems' })
  declare assetItems?: ProcurementAssetItemEntry[];

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare conversionUnit?: string;

  @Column({
    type: DataType.DECIMAL(15, 6),
    allowNull: true,
  })
  declare rate?: number;

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
