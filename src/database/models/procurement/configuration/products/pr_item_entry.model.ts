import type { ProcurementItemEntryAttributes, ProcurementItemEntryCreationAttributes } from '../../../../types/procurementitementry.types';

/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Index,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Category } from './pr_category.model';
import { ProcurementSubCategory } from './pr_sub_category.model';
import { ProcurementBrand } from './pr_brand.model';
import { ProcurementUnit } from './pr_unit.model';
import { ProcurementGrnItem } from '../../grn/pr_grn_item.model';
import { ProcurementRfqItem } from '../../rfq/pr_rfq_item.model';
import { ProcurementPurchaseOrderItem } from '../../purchase-order/pr_purchase_order_item.model';
import { ProcurementMaterialRequisitionItem } from '../../requisition/pr_material_requisition_item.model';

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

  @HasMany(() => ProcurementGrnItem, { foreignKey: 'item_id', sourceKey: 'uuid', as: 'grnItems' })
  declare grnItems?: ProcurementGrnItem[];

  @HasMany(() => ProcurementRfqItem, { foreignKey: 'item_id', sourceKey: 'uuid', as: 'rfqItems' })
  declare rfqItems?: ProcurementRfqItem[];

  @HasMany(() => ProcurementPurchaseOrderItem, { foreignKey: 'item_id', sourceKey: 'uuid', as: 'purchaseOrderItems' })
  declare purchaseOrderItems?: ProcurementPurchaseOrderItem[];

  @HasMany(() => ProcurementMaterialRequisitionItem, { foreignKey: 'item_id', sourceKey: 'uuid', as: 'requisitionItems' })
  declare requisitionItems?: ProcurementMaterialRequisitionItem[];

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string;
}
