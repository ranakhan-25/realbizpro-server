import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
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

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'created_by',
    defaultValue: null,
  })
  declare createdBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'updated_by',
    defaultValue: null,
  })
  declare updatedBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'deleted_by',
    defaultValue: null,
  })
  declare deletedBy?: string | null;

}
