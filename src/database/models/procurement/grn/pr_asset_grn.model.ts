import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { SysUser } from '../../system/sys_user.model';
import { SupplierAccounts } from '../../projects/contract/pr_supplier_accounts.model';
import { Project } from '../../projects/project/pr_project.model';
import { ProjectType } from '../../projects/project-type/pr_project_type.model';
import { BillingCategory } from '../../projects/billing/pr_category.model';
import { Task } from '../../projects/task/pr_task.model';
import { Site } from '../../projects/project-site/pr_project_site.model';
import { ProcurementAssetCategory } from '../configuration/asset/pr_asset_category.model';
import { ProcurementAssetGrnItem } from './pr_asset_grn_item.model';
import { ProcurementAssetPurchaseBill } from '../purchase-bill/pr_asset_purchase_bill.model';
import { ProcurementAssetPurchaseBillGrn } from '../purchase-bill/pr_asset_purchase_bill_grn.model';

import type { ProcurementAssetGrnAttributes, ProcurementAssetGrnCreationAttributes } from '../../../types/procurementassetgrn.types';

export enum ProcurementAssetGrnApprovalLayer {
  PENDING = 'pending',
  ALL_APPROVALS_COMPLETED = 'all_approvals_completed',
  RASEL_HOSAIN = 'rasel_hosain',
  ADMIN = 'admin',
}

export enum ProcurementAssetGrnStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Table({ tableName: 'pr_asset_grn', timestamps: true, paranoid: true, underscored: true })
export class ProcurementAssetGrn extends BaseModel<ProcurementAssetGrnAttributes, ProcurementAssetGrnCreationAttributes> {
  @Column({ type: DataType.DATEONLY, allowNull: false }) declare date: string;
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true }) declare code: string;
  @Column({ type: DataType.STRING(100), allowNull: true }) declare reference?: string;

  @ForeignKey(() => SupplierAccounts) @Column({ type: DataType.UUID, allowNull: false }) declare supplier_id: string;
  @BelongsTo(() => SupplierAccounts, { foreignKey: 'supplier_id', targetKey: 'uuid', as: 'supplier' }) declare supplier?: SupplierAccounts;
  // There is no Chart of Accounts model in this repository; this stores the selected external account identifier.
  @Column({ type: DataType.STRING(100), allowNull: true }) declare ledger_id?: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare ledger_name?: string;

  @ForeignKey(() => ProjectType) @Column({ type: DataType.UUID, allowNull: true }) declare project_type_id?: string;
  @BelongsTo(() => ProjectType, { foreignKey: 'project_type_id', targetKey: 'uuid', as: 'projectType' }) declare projectType?: ProjectType;
  @ForeignKey(() => Project) @Column({ type: DataType.UUID, allowNull: true }) declare project_id?: string;
  @BelongsTo(() => Project, { foreignKey: 'project_id', targetKey: 'uuid', as: 'project' }) declare project?: Project;
  @ForeignKey(() => BillingCategory) @Column({ type: DataType.UUID, allowNull: true }) declare title_of_work_id?: string;
  @BelongsTo(() => BillingCategory, { foreignKey: 'title_of_work_id', targetKey: 'uuid', as: 'titleOfWork' }) declare titleOfWork?: BillingCategory;
  @ForeignKey(() => Task) @Column({ type: DataType.UUID, allowNull: true }) declare task_id?: string;
  @BelongsTo(() => Task, { foreignKey: 'task_id', targetKey: 'uuid', as: 'task' }) declare task?: Task;
  @ForeignKey(() => Site) @Column({ type: DataType.UUID, allowNull: true }) declare site_id?: string;
  @BelongsTo(() => Site, { foreignKey: 'site_id', targetKey: 'uuid', as: 'site' }) declare site?: Site;
  @ForeignKey(() => ProcurementAssetCategory) @Column({ type: DataType.UUID, allowNull: true }) declare category_id?: string;
  @BelongsTo(() => ProcurementAssetCategory, { foreignKey: 'category_id', targetKey: 'uuid', as: 'category' }) declare category?: ProcurementAssetCategory;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare subtotal: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare discount: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare grand_total: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare paid: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare due: number;
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false }) declare already_billed: boolean;
  @Column({ type: DataType.TEXT, allowNull: true }) declare note?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare attachment?: string;

  @ForeignKey(() => SysUser) @Column({ type: DataType.BIGINT, allowNull: true }) declare added_by_id?: number;
  @BelongsTo(() => SysUser, { foreignKey: 'added_by_id', targetKey: 'id', as: 'addedBy' }) declare addedBy?: SysUser;
  @Column({ type: DataType.ENUM(...Object.values(ProcurementAssetGrnApprovalLayer)), allowNull: false, defaultValue: ProcurementAssetGrnApprovalLayer.PENDING }) declare approval_layer: ProcurementAssetGrnApprovalLayer;
  @Column({ type: DataType.ENUM(...Object.values(ProcurementAssetGrnStatus)), allowNull: false, defaultValue: ProcurementAssetGrnStatus.PENDING }) declare status: ProcurementAssetGrnStatus;
  @HasMany(() => ProcurementAssetGrnItem, { foreignKey: 'grn_id', sourceKey: 'uuid', as: 'items' }) declare items?: ProcurementAssetGrnItem[];
  @BelongsToMany(() => ProcurementAssetPurchaseBill, { through: () => ProcurementAssetPurchaseBillGrn, foreignKey: 'grn_id', otherKey: 'purchase_bill_id', sourceKey: 'uuid', targetKey: 'uuid', as: 'purchaseBills' }) declare purchaseBills?: ProcurementAssetPurchaseBill[];

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

}
