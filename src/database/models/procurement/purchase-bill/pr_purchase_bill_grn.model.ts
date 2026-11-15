import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
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
