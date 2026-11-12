import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { MaterialRequisition } from '../material-requisition/pr_material_requisition.model';
import type {
  SiteAttributes,
  SiteCreationAttributes,
} from 'src/database/types/site.types';
import { Project } from '../project/pr_project.model';
import { BaseModel } from 'src/database/base.model';
import { ProjectShareAssignment } from '../project-share-assignment/pr_project_share_assignment.model';
import { WorkOrder } from '../billing/work-order/pr_work_order.model';
import { ProcurementRfq } from '../../procurement/rfq/pr_rfq.model';
import { ProcurementAssetRfq } from '../../procurement/rfq/pr_asset_rfq.model';
import { ProcurementMaterialRequisition } from '../../procurement/requisition/pr_material_requisition.model';
import { ProcurementAssetRequisition } from '../../procurement/requisition/pr_asset_requisition.model';
import { ProcurementPurchaseOrder } from '../../procurement/purchase-order/pr_purchase_order.model';
import { ProcurementAssetPurchaseOrder } from '../../procurement/purchase-order/pr_asset_purchase_order.model';
import { ProcurementGrn } from '../../procurement/grn/pr_grn.model';
import { ProcurementAssetGrn } from '../../procurement/grn/pr_asset_grn.model';
import { ProcurementHireOrder } from '../../procurement/equipment-hire/pr_hire_order.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

@Table({
  tableName: 'sites',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Site
  extends BaseModel<
    SiteAttributes,
    SiteCreationAttributes
  >
  implements SiteAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare location?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare project?: Project;

  @HasMany(() => MaterialRequisition, {
    foreignKey: 'siteId',
    sourceKey: 'uuid',
    as: 'materialRequisitions',
  })
  declare materialRequisitions?: MaterialRequisition[];

  @HasMany(() => ProjectShareAssignment, {
    foreignKey: 'projectTypeId',
    sourceKey: 'uuid',
    as: 'shareAssignments',
  })
  declare shareAssignments?: ProjectShareAssignment[];
  @HasMany(() => WorkOrder, {
    foreignKey: 'siteId',
    sourceKey: 'uuid',
    as: 'workOrders',
  })
  declare workOrders?: WorkOrder[];
  @HasMany(() => ProcurementRfq, { foreignKey: 'site_id', sourceKey: 'uuid', as: 'procurementRfqs' }) declare procurementRfqs?: ProcurementRfq[];
  @HasMany(() => ProcurementAssetRfq, { foreignKey: 'site_id', sourceKey: 'uuid', as: 'procurementAssetRfqs' }) declare procurementAssetRfqs?: ProcurementAssetRfq[];
  @HasMany(() => ProcurementMaterialRequisition, { foreignKey: 'site_id', sourceKey: 'uuid', as: 'procurementMaterialRequisitions' }) declare procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  @HasMany(() => ProcurementAssetRequisition, { foreignKey: 'site_id', sourceKey: 'uuid', as: 'procurementAssetRequisitions' }) declare procurementAssetRequisitions?: ProcurementAssetRequisition[];
  @HasMany(() => ProcurementPurchaseOrder, { foreignKey: 'site_id', sourceKey: 'uuid', as: 'procurementPurchaseOrders' }) declare procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  @HasMany(() => ProcurementAssetPurchaseOrder, { foreignKey: 'site_id', sourceKey: 'uuid', as: 'procurementAssetPurchaseOrders' }) declare procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  @HasMany(() => ProcurementGrn, { foreignKey: 'site_id', sourceKey: 'uuid', as: 'procurementGrns' }) declare procurementGrns?: ProcurementGrn[];
  @HasMany(() => ProcurementAssetGrn, { foreignKey: 'site_id', sourceKey: 'uuid', as: 'procurementAssetGrns' }) declare procurementAssetGrns?: ProcurementAssetGrn[];
  @HasMany(() => ProcurementHireOrder, { foreignKey: 'site_id', sourceKey: 'uuid', as: 'equipmentHireOrders' }) declare equipmentHireOrders?: ProcurementHireOrder[];
  // ─── Audit fields ───────────────────────────────────────
  @Column({
          field: 'created_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare createdBy?: string;

  @Column({
          field: 'updated_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare updatedBy?: any;

  @Column({
          field: 'deleted_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare deletedBy?: string;
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
