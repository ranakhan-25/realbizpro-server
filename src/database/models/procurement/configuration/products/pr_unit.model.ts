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
import { ProcurementGrnItem } from '../../grn/pr_grn_item.model';
import { ProcurementRfqItem } from '../../rfq/pr_rfq_item.model';
import { ProcurementPurchaseOrderItem } from '../../purchase-order/pr_purchase_order_item.model';
import { ProcurementMaterialRequisitionItem } from '../../requisition/pr_material_requisition_item.model';
import { ProcurementAssetRfqItem } from '../../rfq/pr_asset_rfq_item.model';
import { ProcurementAssetPurchaseOrderItem } from '../../purchase-order/pr_asset_purchase_order_item.model';
import { ProcurementAssetRequisitionItem } from '../../requisition/pr_asset_requisition_item.model';
import { ProcurementAssetGrnItem } from '../../grn/pr_asset_grn_item.model';

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

  @HasMany(() => ProcurementGrnItem, { foreignKey: 'unit_id', sourceKey: 'uuid', as: 'grnItems' })
  declare grnItems?: ProcurementGrnItem[];

  @HasMany(() => ProcurementRfqItem, { foreignKey: 'unit_id', sourceKey: 'uuid', as: 'rfqItems' })
  declare rfqItems?: ProcurementRfqItem[];

  @HasMany(() => ProcurementPurchaseOrderItem, { foreignKey: 'unit_id', sourceKey: 'uuid', as: 'purchaseOrderItems' })
  declare purchaseOrderItems?: ProcurementPurchaseOrderItem[];

  @HasMany(() => ProcurementMaterialRequisitionItem, { foreignKey: 'unit_id', sourceKey: 'uuid', as: 'requisitionItems' })
  declare requisitionItems?: ProcurementMaterialRequisitionItem[];

  @HasMany(() => ProcurementAssetRfqItem, { foreignKey: 'unit_id', sourceKey: 'uuid', as: 'assetRfqItems' })
  declare assetRfqItems?: ProcurementAssetRfqItem[];

  @HasMany(() => ProcurementAssetPurchaseOrderItem, { foreignKey: 'unit_id', sourceKey: 'uuid', as: 'assetPurchaseOrderItems' })
  declare assetPurchaseOrderItems?: ProcurementAssetPurchaseOrderItem[];

  @HasMany(() => ProcurementAssetRequisitionItem, { foreignKey: 'unit_id', sourceKey: 'uuid', as: 'assetRequisitionItems' })
  declare assetRequisitionItems?: ProcurementAssetRequisitionItem[];

  @HasMany(() => ProcurementAssetGrnItem, { foreignKey: 'unit_id', sourceKey: 'uuid', as: 'assetGrnItems' })
  declare assetGrnItems?: ProcurementAssetGrnItem[];

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
