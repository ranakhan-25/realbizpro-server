import type { ProcurementItemEntryAttributes, ProcurementItemEntryCreationAttributes } from '../../../../types/procurementitementry.types';

/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Category } from './pr_category.model';
import { ProcurementSubCategory } from './pr_sub_category.model';
import { ProcurementBrand } from './pr_brand.model';
import { ProcurementUnit } from './pr_unit.model';

@Table({ tableName: 'pr_item_entry', timestamps: true, paranoid: true })
export class ProcurementItemEntry extends BaseModel<ProcurementItemEntryAttributes, ProcurementItemEntryCreationAttributes> {
  @Index({ name: 'idx_pr_item_entry_code' })
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare item_code: string;

  @Index({ name: 'idx_pr_item_entry_name' })
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare purchase_price: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare sale_price: number;

  @ForeignKey(() => Category)
  @Index({ name: 'idx_pr_item_entry_category' })
  @Column({ type: DataType.UUID, allowNull: false })
  declare category_id: string;

  @BelongsTo(() => Category, { foreignKey: 'category_id', targetKey: 'uuid', as: 'category' })
  declare category?: Category;

  @ForeignKey(() => ProcurementSubCategory)
  @Column({ type: DataType.UUID, allowNull: true })
  declare sub_category_id?: string | null;

  @BelongsTo(() => ProcurementSubCategory, { foreignKey: 'sub_category_id', targetKey: 'uuid', as: 'sub_category' })
  declare sub_category?: ProcurementSubCategory;

  @ForeignKey(() => ProcurementBrand)
  @Column({ type: DataType.UUID, allowNull: true })
  declare brand_id?: string | null;

  @BelongsTo(() => ProcurementBrand, { foreignKey: 'brand_id', targetKey: 'uuid', as: 'brand' })
  declare brand?: ProcurementBrand;

  @ForeignKey(() => ProcurementUnit)
  @Column({ type: DataType.UUID, allowNull: false })
  declare unit_id: string;

  @BelongsTo(() => ProcurementUnit, { foreignKey: 'unit_id', targetKey: 'uuid', as: 'unit' })
  declare unit?: ProcurementUnit;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string;
}
