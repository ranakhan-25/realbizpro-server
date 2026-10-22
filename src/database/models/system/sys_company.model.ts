import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../base.model';
import type {
  SysCompanyAttributes,
  SysCompanyCreationAttributes,
} from '../../types/syscompany.types';
import { ProcurementRfq } from '../procurement/rfq/pr_rfq.model';
import { ProcurementAssetRfq } from '../procurement/rfq/pr_asset_rfq.model';
import { ProcurementMaterialRequisition } from '../procurement/requisition/pr_material_requisition.model';
import { ProcurementAssetRequisition } from '../procurement/requisition/pr_asset_requisition.model';
import { ProcurementPurchaseOrder } from '../procurement/purchase-order/pr_purchase_order.model';
import { ProcurementAssetPurchaseOrder } from '../procurement/purchase-order/pr_asset_purchase_order.model';
import { ProcurementGrn } from '../procurement/grn/pr_grn.model';
import { ProcurementPurchaseBill } from '../procurement/purchase-bill/pr_purchase_bill.model';

@Table({
  tableName: 'sys_company',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [{ fields: ['uuid'], unique: true }],
})
export class SysCompany extends BaseModel<
  SysCompanyAttributes,
  SysCompanyCreationAttributes
> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare address: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare bnName?: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare bnAddress: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare mobile: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  declare telephone?: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  declare ipPhone?: string;

  @Column({
    type: DataType.STRING(25),
    allowNull: true,
    field: 'vat_reg_num',
  })
  declare vatRegNum: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare website: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare logo: string;

  @Column({
    type: DataType.ENUM('Active', 'Inactive'),
    allowNull: false,
    defaultValue: 'Active',
  })
  declare status: 'Active' | 'Inactive';

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'created_by',
  })
  declare createdBy: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'deleted_by',
  })
  declare deletedBy: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'updated_by',
  })
  declare updatedBy?: number;

  @HasMany(() => ProcurementRfq, { foreignKey: 'company_id', sourceKey: 'uuid', as: 'procurementRfqs' }) declare procurementRfqs?: ProcurementRfq[];
  @HasMany(() => ProcurementAssetRfq, { foreignKey: 'company_id', sourceKey: 'uuid', as: 'procurementAssetRfqs' }) declare procurementAssetRfqs?: ProcurementAssetRfq[];
  @HasMany(() => ProcurementMaterialRequisition, { foreignKey: 'company_id', sourceKey: 'uuid', as: 'procurementMaterialRequisitions' }) declare procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  @HasMany(() => ProcurementAssetRequisition, { foreignKey: 'company_id', sourceKey: 'uuid', as: 'procurementAssetRequisitions' }) declare procurementAssetRequisitions?: ProcurementAssetRequisition[];
  @HasMany(() => ProcurementPurchaseOrder, { foreignKey: 'company_id', sourceKey: 'uuid', as: 'procurementPurchaseOrders' }) declare procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  @HasMany(() => ProcurementAssetPurchaseOrder, { foreignKey: 'company_id', sourceKey: 'uuid', as: 'procurementAssetPurchaseOrders' }) declare procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  @HasMany(() => ProcurementGrn, { foreignKey: 'company_id', sourceKey: 'uuid', as: 'procurementGrns' }) declare procurementGrns?: ProcurementGrn[];
  @HasMany(() => ProcurementPurchaseBill, { foreignKey: 'company_id', sourceKey: 'uuid', as: 'procurementPurchaseBills' }) declare procurementPurchaseBills?: ProcurementPurchaseBill[];
}
