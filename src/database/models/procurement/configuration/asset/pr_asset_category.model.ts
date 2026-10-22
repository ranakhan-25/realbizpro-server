import type { ProcurementAssetCategoryAttributes, ProcurementAssetCategoryCreationAttributes } from '../../../../types/procurementassetcategory.types';

/* eslint-disable prettier/prettier */
import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { ProcurementAssetItemEntry } from './pr_asset_item_entry.model';
import { ProcurementAssetRfq } from '../../rfq/pr_asset_rfq.model';
import { ProcurementAssetPurchaseOrder } from '../../purchase-order/pr_asset_purchase_order.model';
import { ProcurementAssetRequisition } from '../../requisition/pr_asset_requisition.model';
import { ProcurementAssetGrn } from '../../grn/pr_asset_grn.model';

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

  @HasMany(() => ProcurementAssetRfq, { foreignKey: 'category_id', sourceKey: 'uuid', as: 'rfqs' })
  declare rfqs?: ProcurementAssetRfq[];

  @HasMany(() => ProcurementAssetPurchaseOrder, { foreignKey: 'category_id', sourceKey: 'uuid', as: 'purchaseOrders' })
  declare purchaseOrders?: ProcurementAssetPurchaseOrder[];

  @HasMany(() => ProcurementAssetRequisition, { foreignKey: 'category_id', sourceKey: 'uuid', as: 'requisitions' })
  declare requisitions?: ProcurementAssetRequisition[];

  @HasMany(() => ProcurementAssetGrn, { foreignKey: 'category_id', sourceKey: 'uuid', as: 'grns' })
  declare grns?: ProcurementAssetGrn[];

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string;
}
