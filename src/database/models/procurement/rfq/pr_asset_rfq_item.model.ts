import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementAssetItemEntry } from '../configuration/asset/pr_asset_item_entry.model';
import { ProcurementUnit } from '../configuration/products/pr_unit.model';
import { ProcurementAssetRfq } from './pr_asset_rfq.model';

import type { ProcurementAssetRfqItemAttributes, ProcurementAssetRfqItemCreationAttributes } from '../../../types/procurementassetrfqitem.types';

@Table({ tableName: 'pr_asset_rfq_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementAssetRfqItem extends BaseModel<ProcurementAssetRfqItemAttributes, ProcurementAssetRfqItemCreationAttributes> {
  @ForeignKey(() => ProcurementAssetRfq) @Column({ type: DataType.UUID, allowNull: false }) declare rfq_id: string;
  @BelongsTo(() => ProcurementAssetRfq, { foreignKey: 'rfq_id', targetKey: 'uuid', as: 'rfq', onDelete: 'CASCADE' }) declare rfq?: ProcurementAssetRfq;
  @ForeignKey(() => ProcurementAssetItemEntry) @Column({ type: DataType.UUID, allowNull: false }) declare item_id: string;
  @BelongsTo(() => ProcurementAssetItemEntry, { foreignKey: 'item_id', targetKey: 'uuid', as: 'item' }) declare item?: ProcurementAssetItemEntry;
  @ForeignKey(() => ProcurementUnit) @Column({ type: DataType.UUID, allowNull: false }) declare unit_id: string;
  @BelongsTo(() => ProcurementUnit, { foreignKey: 'unit_id', targetKey: 'uuid', as: 'unitRelation' }) declare unitRelation?: ProcurementUnit;
  @Column({ type: DataType.STRING(100), allowNull: false }) declare item_code: string;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare item_name: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare details?: string;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare unit: string;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare quantity: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare rate: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare required_qty: number;
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
