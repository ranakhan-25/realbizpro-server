import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementItemEntry } from '../configuration/products/pr_item_entry.model';
import { ProcurementUnit } from '../configuration/products/pr_unit.model';
import { ProcurementPurchaseOrder } from './pr_purchase_order.model';
import { ProcurementGrnItem } from '../grn/pr_grn_item.model';

import type { ProcurementPurchaseOrderItemAttributes, ProcurementPurchaseOrderItemCreationAttributes } from '../../../types/procurementpurchaseorderitem.types';

@Table({ tableName: 'pr_purchase_order_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementPurchaseOrderItem extends BaseModel<ProcurementPurchaseOrderItemAttributes, ProcurementPurchaseOrderItemCreationAttributes> {
  @ForeignKey(() => ProcurementPurchaseOrder) @Column({ type: DataType.UUID, allowNull: false }) declare purchase_order_id: string;
  @BelongsTo(() => ProcurementPurchaseOrder, { foreignKey: 'purchase_order_id', targetKey: 'uuid', as: 'purchaseOrder', onDelete: 'CASCADE' }) declare purchaseOrder?: ProcurementPurchaseOrder;
  @ForeignKey(() => ProcurementItemEntry) @Column({ type: DataType.UUID, allowNull: true }) declare item_id?: string;
  @BelongsTo(() => ProcurementItemEntry, { foreignKey: 'item_id', targetKey: 'uuid', as: 'item' }) declare item?: ProcurementItemEntry;
  @ForeignKey(() => ProcurementUnit) @Column({ type: DataType.UUID, allowNull: true }) declare unit_id?: string;
  @BelongsTo(() => ProcurementUnit, { foreignKey: 'unit_id', targetKey: 'uuid', as: 'unitRelation' }) declare unitRelation?: ProcurementUnit;
  @HasMany(() => ProcurementGrnItem, { foreignKey: 'purchase_order_item_id', sourceKey: 'uuid', as: 'grnItems' }) declare grnItems?: ProcurementGrnItem[];
  @Column({ type: DataType.STRING(100), allowNull: false }) declare item_code: string;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare item_name: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare details?: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare unit?: string;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare quantity: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare rate: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare budget_qty: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare purchase_qty: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare stock_qty: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare amount: number;
  @Column({ type: DataType.STRING, allowNull: true }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deletedBy?: string;


  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'org_id',
    defaultValue: null,
  })
  declare orgId?: number | null;

  @BelongsTo(() => SysOrganization, {
    foreignKey: 'orgId',
    targetKey: 'id',
    as: 'organization',
  })
  declare organization?: SysOrganization;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
    defaultValue: null,
  })
  declare projectId?: string | null;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

}
