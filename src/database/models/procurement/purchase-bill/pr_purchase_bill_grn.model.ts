import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementPurchaseBill } from './pr_purchase_bill.model';
import { ProcurementGrn } from '../grn/pr_grn.model';

import type { ProcurementPurchaseBillGrnAttributes, ProcurementPurchaseBillGrnCreationAttributes } from '../../../types/procurementpurchasebillgrn.types';

@Table({ tableName: 'pr_purchase_bill_grns', timestamps: true, paranoid: true, underscored: true })
export class ProcurementPurchaseBillGrn extends BaseModel<ProcurementPurchaseBillGrnAttributes, ProcurementPurchaseBillGrnCreationAttributes> {
  @ForeignKey(() => ProcurementPurchaseBill) @Column({ type: DataType.UUID, allowNull: false, unique: true }) declare purchase_bill_id: string;
  @BelongsTo(() => ProcurementPurchaseBill, { foreignKey: 'purchase_bill_id', targetKey: 'uuid', as: 'purchaseBill' }) declare purchaseBill?: ProcurementPurchaseBill;
  @ForeignKey(() => ProcurementGrn) @Column({ type: DataType.UUID, allowNull: false, unique: true }) declare grn_id: string;
  @BelongsTo(() => ProcurementGrn, { foreignKey: 'grn_id', targetKey: 'uuid', as: 'grn' }) declare grn?: ProcurementGrn;
}
