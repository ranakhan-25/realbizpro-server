import type { ProcurementAssetItemEntryAttributes, ProcurementAssetItemEntryCreationAttributes } from '../../../../types/procurementassetitementry.types';

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
import { ProcurementAssetCategory } from './pr_asset_category.model';
import { ProcurementBrand } from '../products/pr_brand.model';
import { ProcurementUnit } from '../products/pr_unit.model';
import { ProcurementAssetRfqItem } from '../../rfq/pr_asset_rfq_item.model';
import { ProcurementAssetPurchaseOrderItem } from '../../purchase-order/pr_asset_purchase_order_item.model';
import { ProcurementAssetRequisitionItem } from '../../requisition/pr_asset_requisition_item.model';
import { ProcurementAssetGrnItem } from '../../grn/pr_asset_grn_item.model';

@Table({ tableName: 'pr_asset_item_entry', timestamps: true, paranoid: true })
export class ProcurementAssetItemEntry extends BaseModel<ProcurementAssetItemEntryAttributes, ProcurementAssetItemEntryCreationAttributes> {
  @Index({ name: 'idx_pr_asset_item_code' })
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare item_code: string;

  @Index({ name: 'idx_pr_asset_item_name' })
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @ForeignKey(() => ProcurementAssetCategory)
  @Index({ name: 'idx_pr_asset_item_category' })
  @Column({ type: DataType.UUID, allowNull: false })
  declare category_id: string;

  @BelongsTo(() => ProcurementAssetCategory, {
    foreignKey: 'category_id', targetKey: 'uuid', as: 'category',
  })
  declare category?: ProcurementAssetCategory;

  @ForeignKey(() => ProcurementUnit)
  @Column({ type: DataType.UUID, allowNull: false })
  declare unit_id: string;

  @BelongsTo(() => ProcurementUnit, {
    foreignKey: 'unit_id', targetKey: 'uuid', as: 'unit',
  })
  declare unit?: ProcurementUnit;

  @ForeignKey(() => ProcurementBrand)
  @Column({ type: DataType.UUID, allowNull: true })
  declare brand_id?: string | null;

  @BelongsTo(() => ProcurementBrand, {
    foreignKey: 'brand_id', targetKey: 'uuid', as: 'brand',
  })
  declare brand?: ProcurementBrand;

  @HasMany(() => ProcurementAssetRfqItem, { foreignKey: 'item_id', sourceKey: 'uuid', as: 'rfqItems' })
  declare rfqItems?: ProcurementAssetRfqItem[];

  @HasMany(() => ProcurementAssetPurchaseOrderItem, { foreignKey: 'item_id', sourceKey: 'uuid', as: 'purchaseOrderItems' })
  declare purchaseOrderItems?: ProcurementAssetPurchaseOrderItem[];

  @HasMany(() => ProcurementAssetRequisitionItem, { foreignKey: 'item_id', sourceKey: 'uuid', as: 'requisitionItems' })
  declare requisitionItems?: ProcurementAssetRequisitionItem[];

  @HasMany(() => ProcurementAssetGrnItem, { foreignKey: 'item_id', sourceKey: 'uuid', as: 'grnItems' })
  declare grnItems?: ProcurementAssetGrnItem[];

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare purchase_price: number;

  // The repository has no chart-of-groups master model/table yet.
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare chart_of_group_id?: number | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string;
}
