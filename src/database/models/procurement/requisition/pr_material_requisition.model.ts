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
import { ProcurementMaterialRequisitionItem } from './pr_material_requisition_item.model';
import { ProcurementGrn } from '../grn/pr_grn.model';
import { ProcurementPurchaseOrder } from '../purchase-order/pr_purchase_order.model';

import type { ProcurementMaterialRequisitionAttributes, ProcurementMaterialRequisitionCreationAttributes } from '../../../types/procurementmaterialrequisition.types';

export enum ProcurementMaterialRequisitionApprovalLayer {
  PENDING = 'pending',
  ALL_APPROVALS_COMPLETED = 'all_approvals_completed',
  RASEL_HOSAIN = 'rasel_hosain',
  ADMIN = 'admin',
}

export enum ProcurementMaterialRequisitionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Table({ tableName: 'pr_material_requisition', timestamps: true, paranoid: true, underscored: true })
export class ProcurementMaterialRequisition extends BaseModel<ProcurementMaterialRequisitionAttributes, ProcurementMaterialRequisitionCreationAttributes> {
  @Column({ type: DataType.DATEONLY, allowNull: false }) declare date: string;
  @Column({ type: DataType.DATEONLY, allowNull: true }) declare demand_date?: string;
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true }) declare code: string;
  @Column({ type: DataType.STRING(100), allowNull: true }) declare ref?: string;
  @ForeignKey(() => SysCompany) @Column({ type: DataType.UUID, allowNull: true }) declare company_id?: string;
  @BelongsTo(() => SysCompany, { foreignKey: 'company_id', targetKey: 'uuid', as: 'company' }) declare company?: SysCompany;
  @ForeignKey(() => SupplierAccounts) @Column({ type: DataType.UUID, allowNull: true }) declare supplier_id?: string;
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
  @Column({ type: DataType.TEXT, allowNull: true }) declare note?: string;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare total: number;
  @Column({ type: DataType.TEXT, allowNull: true }) declare attachment?: string;
  @ForeignKey(() => SysUser) @Column({ type: DataType.BIGINT, allowNull: true }) declare added_by_id?: number;
  @BelongsTo(() => SysUser, { foreignKey: 'added_by_id', targetKey: 'id', as: 'addedBy' }) declare addedBy?: SysUser;
  @Column({ type: DataType.ENUM(...Object.values(ProcurementMaterialRequisitionApprovalLayer)), allowNull: false, defaultValue: ProcurementMaterialRequisitionApprovalLayer.PENDING }) declare approval_layer: ProcurementMaterialRequisitionApprovalLayer;
  @Column({ type: DataType.ENUM(...Object.values(ProcurementMaterialRequisitionStatus)), allowNull: false, defaultValue: ProcurementMaterialRequisitionStatus.PENDING }) declare status: ProcurementMaterialRequisitionStatus;
  @HasMany(() => ProcurementMaterialRequisitionItem, { foreignKey: 'requisition_id', sourceKey: 'uuid', as: 'items' }) declare items?: ProcurementMaterialRequisitionItem[];
  @HasMany(() => ProcurementGrn, { foreignKey: 'requisition_id', sourceKey: 'uuid', as: 'grns' }) declare grns?: ProcurementGrn[];
  @HasMany(() => ProcurementPurchaseOrder, { foreignKey: 'requisition_id', sourceKey: 'uuid', as: 'purchaseOrders' }) declare purchaseOrders?: ProcurementPurchaseOrder[];
  @Column({ type: DataType.STRING, allowNull: true }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deletedBy?: string;
}
