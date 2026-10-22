import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementAssetPurchaseBill } from './pr_asset_purchase_bill.model';
import { ProcurementAssetGrn } from '../grn/pr_asset_grn.model';
import type { ProcurementAssetPurchaseBillGrnAttributes, ProcurementAssetPurchaseBillGrnCreationAttributes } from '../../../types/procurementassetpurchasebillgrn.types';

@Table({ tableName: 'pr_asset_purchase_bill_grns', timestamps: true, paranoid: true, underscored: true })
export class ProcurementAssetPurchaseBillGrn extends BaseModel<ProcurementAssetPurchaseBillGrnAttributes, ProcurementAssetPurchaseBillGrnCreationAttributes> {
  @ForeignKey(() => ProcurementAssetPurchaseBill) @Column({ type: DataType.UUID, allowNull: false }) declare purchase_bill_id: string;
  @BelongsTo(() => ProcurementAssetPurchaseBill, { foreignKey: 'purchase_bill_id', targetKey: 'uuid', as: 'purchaseBill' }) declare purchaseBill?: ProcurementAssetPurchaseBill;
  @ForeignKey(() => ProcurementAssetGrn) @Column({ type: DataType.UUID, allowNull: false, unique: true }) declare grn_id: string;
  @BelongsTo(() => ProcurementAssetGrn, { foreignKey: 'grn_id', targetKey: 'uuid', as: 'grn' }) declare grn?: ProcurementAssetGrn;
}
