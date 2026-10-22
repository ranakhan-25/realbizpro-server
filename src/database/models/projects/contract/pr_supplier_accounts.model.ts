/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  SupplierAccountsAttributes,
  SupplierAccountsCreationAttributes,
  SupplierAccountsUpdateAttributes,
} from 'src/database/types/supplieraccounts.types';
import { ProcurementRfq } from '../../procurement/rfq/pr_rfq.model';
import { ProcurementAssetRfq } from '../../procurement/rfq/pr_asset_rfq.model';
import { ProcurementMaterialRequisition } from '../../procurement/requisition/pr_material_requisition.model';
import { ProcurementAssetRequisition } from '../../procurement/requisition/pr_asset_requisition.model';
import { ProcurementPurchaseOrder } from '../../procurement/purchase-order/pr_purchase_order.model';
import { ProcurementAssetPurchaseOrder } from '../../procurement/purchase-order/pr_asset_purchase_order.model';
import { ProcurementGrn } from '../../procurement/grn/pr_grn.model';
import { ProcurementPurchaseBill } from '../../procurement/purchase-bill/pr_purchase_bill.model';
import { ProcurementAssetPurchaseBill } from '../../procurement/purchase-bill/pr_asset_purchase_bill.model';
import { ProcurementAssetGrn } from '../../procurement/grn/pr_asset_grn.model';

export enum SupplierAccountsStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

@Table({
  tableName: 'supplier_accounts',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'SupplierAccounts_supplierCode_idx',
      fields: ['supplierCode'],
    },
    {
      name: 'SupplierAccounts_phone_idx',
      fields: ['phone'],
    },
    {
      name: 'SupplierAccounts_email_idx',
      fields: ['email'],
    },
    {
      name: 'SupplierAccounts_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class SupplierAccounts
  extends BaseModel<
    SupplierAccountsUpdateAttributes,
    SupplierAccountsCreationAttributes
  >
  implements SupplierAccountsAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare supplierCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare supplierName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare businessName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address?: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare creditLimit?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dueDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'Sundry Creditors',
  })
  declare underGroup?: string;

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

  @Column({
    type: DataType.ENUM(
      ...Object.values(SupplierAccountsStatus),
    ),
    allowNull: false,
    defaultValue: SupplierAccountsStatus.ACTIVE,
  })
  declare status: SupplierAccountsStatus;

  @HasMany(() => ProcurementRfq, { foreignKey: 'supplier_id', sourceKey: 'uuid', as: 'procurementRfqs' }) declare procurementRfqs?: ProcurementRfq[];
  @HasMany(() => ProcurementAssetRfq, { foreignKey: 'supplier_id', sourceKey: 'uuid', as: 'procurementAssetRfqs' }) declare procurementAssetRfqs?: ProcurementAssetRfq[];
  @HasMany(() => ProcurementMaterialRequisition, { foreignKey: 'supplier_id', sourceKey: 'uuid', as: 'procurementMaterialRequisitions' }) declare procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  @HasMany(() => ProcurementAssetRequisition, { foreignKey: 'supplier_id', sourceKey: 'uuid', as: 'procurementAssetRequisitions' }) declare procurementAssetRequisitions?: ProcurementAssetRequisition[];
  @HasMany(() => ProcurementPurchaseOrder, { foreignKey: 'supplier_id', sourceKey: 'uuid', as: 'procurementPurchaseOrders' }) declare procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  @HasMany(() => ProcurementAssetPurchaseOrder, { foreignKey: 'supplier_id', sourceKey: 'uuid', as: 'procurementAssetPurchaseOrders' }) declare procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  @HasMany(() => ProcurementGrn, { foreignKey: 'supplier_id', sourceKey: 'uuid', as: 'procurementGrns' }) declare procurementGrns?: ProcurementGrn[];
  @HasMany(() => ProcurementPurchaseBill, { foreignKey: 'supplier_id', sourceKey: 'uuid', as: 'procurementPurchaseBills' }) declare procurementPurchaseBills?: ProcurementPurchaseBill[];
  @HasMany(() => ProcurementAssetGrn, { foreignKey: 'supplier_id', sourceKey: 'uuid', as: 'procurementAssetGrns' }) declare procurementAssetGrns?: ProcurementAssetGrn[];
  @HasMany(() => ProcurementAssetPurchaseBill, { foreignKey: 'supplier_id', sourceKey: 'uuid', as: 'procurementAssetPurchaseBills' }) declare procurementAssetPurchaseBills?: ProcurementAssetPurchaseBill[];
}
