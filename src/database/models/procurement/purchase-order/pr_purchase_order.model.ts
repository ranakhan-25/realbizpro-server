import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { SysCompany } from '../../system/sys_company.model';
import { SysUser } from '../../system/sys_user.model';
import { SupplierAccounts } from '../../projects/contract/pr_supplier_accounts.model';
import { Project } from '../../projects/project/pr_project.model';
import { ProjectType } from '../../projects/project-type/pr_project_type.model';
import { BillingCategory } from '../../projects/billing/pr_category.model';
import { Task } from '../../projects/task/pr_task.model';
import { Site } from '../../projects/project-site/pr_project_site.model';
import { Category } from '../configuration/products/pr_category.model';
import { ProcurementMaterialRequisition } from '../requisition/pr_material_requisition.model';
import { ProcurementPurchaseOrderItem } from './pr_purchase_order_item.model';
import { ProcurementGrn } from '../grn/pr_grn.model';

import type { ProcurementPurchaseOrderAttributes, ProcurementPurchaseOrderCreationAttributes } from '../../../types/procurementpurchaseorder.types';

export enum ProcurementPurchaseOrderApprovalLayer {
  PENDING = 'pending',
  ALL_APPROVALS_COMPLETED = 'all_approvals_completed',
  RASEL_HOSAIN = 'rasel_hosain',
  ADMIN = 'admin',
}

export enum ProcurementPurchaseOrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Table({ tableName: 'pr_purchase_order', timestamps: true, paranoid: true, underscored: true })
export class ProcurementPurchaseOrder extends BaseModel<ProcurementPurchaseOrderAttributes, ProcurementPurchaseOrderCreationAttributes> {
  @Column({ type: DataType.DATEONLY, allowNull: false }) declare date: string;
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true }) declare code: string;
  @Column({ type: DataType.STRING(100), allowNull: true }) declare reference?: string;
  @ForeignKey(() => SysCompany) @Column({ type: DataType.UUID, allowNull: true }) declare company_id?: string;
  @BelongsTo(() => SysCompany, { foreignKey: 'company_id', targetKey: 'uuid', as: 'company' }) declare company?: SysCompany;
  @ForeignKey(() => SupplierAccounts) @Column({ type: DataType.UUID, allowNull: false }) declare supplier_id: string;
  @BelongsTo(() => SupplierAccounts, { foreignKey: 'supplier_id', targetKey: 'uuid', as: 'supplier' }) declare supplier?: SupplierAccounts;
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
  @ForeignKey(() => Category) @Column({ type: DataType.UUID, allowNull: true }) declare category_id?: string;
  @BelongsTo(() => Category, { foreignKey: 'category_id', targetKey: 'uuid', as: 'category' }) declare category?: Category;
  @ForeignKey(() => ProcurementMaterialRequisition) @Column({ type: DataType.UUID, allowNull: true }) declare requisition_id?: string;
  @BelongsTo(() => ProcurementMaterialRequisition, { foreignKey: 'requisition_id', targetKey: 'uuid', as: 'requisition' }) declare requisition?: ProcurementMaterialRequisition;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare subtotal: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare grand_total: number;
  @Column({ type: DataType.TEXT, allowNull: true }) declare note?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare attachment?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare content_footer?: string;
  @ForeignKey(() => SysUser) @Column({ type: DataType.BIGINT, allowNull: true }) declare added_by_id?: number;
  @BelongsTo(() => SysUser, { foreignKey: 'added_by_id', targetKey: 'id', as: 'addedBy' }) declare addedBy?: SysUser;
  @Column({ type: DataType.ENUM(...Object.values(ProcurementPurchaseOrderApprovalLayer)), allowNull: false, defaultValue: ProcurementPurchaseOrderApprovalLayer.PENDING }) declare approval_layer: ProcurementPurchaseOrderApprovalLayer;
  @Column({ type: DataType.ENUM(...Object.values(ProcurementPurchaseOrderStatus)), allowNull: false, defaultValue: ProcurementPurchaseOrderStatus.PENDING }) declare status: ProcurementPurchaseOrderStatus;
  @HasMany(() => ProcurementPurchaseOrderItem, { foreignKey: 'purchase_order_id', sourceKey: 'uuid', as: 'items' }) declare items?: ProcurementPurchaseOrderItem[];
  @HasMany(() => ProcurementGrn, { foreignKey: 'purchase_order_id', sourceKey: 'uuid', as: 'grns' }) declare grns?: ProcurementGrn[];
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
