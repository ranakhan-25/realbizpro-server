import type { ProcurementAssetCategoryAttributes, ProcurementAssetCategoryCreationAttributes } from '../../../../types/procurementassetcategory.types';

/* eslint-disable prettier/prettier */
import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { ProcurementAssetItemEntry } from './pr_asset_item_entry.model';

@Table({ tableName: 'pr_asset_category', timestamps: true, paranoid: true })
export class ProcurementAssetCategory extends BaseModel<ProcurementAssetCategoryAttributes, ProcurementAssetCategoryCreationAttributes> {
  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'Asset' })
  declare type: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare code: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @HasMany(() => ProcurementAssetItemEntry, {
    foreignKey: 'category_id', sourceKey: 'uuid', as: 'items',
  })
  declare items?: ProcurementAssetItemEntry[];

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string;
}
