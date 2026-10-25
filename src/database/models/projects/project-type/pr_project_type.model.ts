import {
  BeforeValidate,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import {
  ProjectTypeAttributes,
  ProjectTypeCreationAttributes,
  ProjectTypeUpdateAttributes,
} from 'src/database/types/projecttype.types';
import { ProjectShareAssignment } from '../project-share-assignment/pr_project_share_assignment.model';
import { Invoice } from '../billing/pr_invoice.model';
import { WorkOrder } from '../billing/work-order/pr_work_order.model';
import { ProcurementRfq } from '../../procurement/rfq/pr_rfq.model';
import { ProcurementAssetRfq } from '../../procurement/rfq/pr_asset_rfq.model';
import { ProcurementMaterialRequisition } from '../../procurement/requisition/pr_material_requisition.model';
import { ProcurementAssetRequisition } from '../../procurement/requisition/pr_asset_requisition.model';
import { ProcurementPurchaseOrder } from '../../procurement/purchase-order/pr_purchase_order.model';
import { ProcurementAssetPurchaseOrder } from '../../procurement/purchase-order/pr_asset_purchase_order.model';
import { ProcurementGrn } from '../../procurement/grn/pr_grn.model';
import { ProcurementPurchaseBill } from '../../procurement/purchase-bill/pr_purchase_bill.model';
import { ProcurementAssetPurchaseBill } from '../../procurement/purchase-bill/pr_asset_purchase_bill.model';
import { ProcurementAssetGrn } from '../../procurement/grn/pr_asset_grn.model';
import { Project } from '../project/pr_project.model';

@Table({
  tableName: 'project_types',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProjectType
  extends BaseModel<
    ProjectTypeUpdateAttributes,
    ProjectTypeCreationAttributes
  >
  implements ProjectTypeAttributes
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

  @HasMany(() => ProjectShareAssignment, {
    foreignKey: 'projectTypeId',
    sourceKey: 'uuid',
    as: 'shareAssignments',
  })
  declare shareAssignments?: ProjectShareAssignment[];

  @HasMany(() => Invoice, {
    foreignKey: 'projectTypeId',
    sourceKey: 'uuid',
    as: 'invoices',
  })
  declare invoices?: Invoice[];

  @HasMany(() => Project, { foreignKey: 'projectType', sourceKey: 'uuid', as: 'projects' })
  declare projects?: Project[];
  @HasMany(() => WorkOrder, {
    foreignKey: 'projectTypeId',
    sourceKey: 'uuid',
    as: 'workOrders',
  })
  declare workOrders?: WorkOrder[];
  @HasMany(() => ProcurementRfq, { foreignKey: 'project_type_id', sourceKey: 'uuid', as: 'procurementRfqs' }) declare procurementRfqs?: ProcurementRfq[];
  @HasMany(() => ProcurementAssetRfq, { foreignKey: 'project_type_id', sourceKey: 'uuid', as: 'procurementAssetRfqs' }) declare procurementAssetRfqs?: ProcurementAssetRfq[];
  @HasMany(() => ProcurementMaterialRequisition, { foreignKey: 'project_type_id', sourceKey: 'uuid', as: 'procurementMaterialRequisitions' }) declare procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  @HasMany(() => ProcurementAssetRequisition, { foreignKey: 'project_type_id', sourceKey: 'uuid', as: 'procurementAssetRequisitions' }) declare procurementAssetRequisitions?: ProcurementAssetRequisition[];
  @HasMany(() => ProcurementPurchaseOrder, { foreignKey: 'project_type_id', sourceKey: 'uuid', as: 'procurementPurchaseOrders' }) declare procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  @HasMany(() => ProcurementAssetPurchaseOrder, { foreignKey: 'project_type_id', sourceKey: 'uuid', as: 'procurementAssetPurchaseOrders' }) declare procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  @HasMany(() => ProcurementGrn, { foreignKey: 'project_type_id', sourceKey: 'uuid', as: 'procurementGrns' }) declare procurementGrns?: ProcurementGrn[];
  @HasMany(() => ProcurementPurchaseBill, { foreignKey: 'project_type_id', sourceKey: 'uuid', as: 'procurementPurchaseBills' }) declare procurementPurchaseBills?: ProcurementPurchaseBill[];
  @HasMany(() => ProcurementAssetGrn, { foreignKey: 'project_type_id', sourceKey: 'uuid', as: 'procurementAssetGrns' }) declare procurementAssetGrns?: ProcurementAssetGrn[];
  @HasMany(() => ProcurementAssetPurchaseBill, { foreignKey: 'project_type_id', sourceKey: 'uuid', as: 'procurementAssetPurchaseBills' }) declare procurementAssetPurchaseBills?: ProcurementAssetPurchaseBill[];

  // ─── Audit fields ───────────────────────────────────────
  @Column({
    type: DataType.INTEGER, // change to STRING / UUID if needed
    allowNull: true,
  })
  declare createdBy?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare updatedBy?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare deletedBy?: number;

  // Image e dekha format: P + 7 digit (e.g. P4773027)
  @BeforeValidate
  static generateCode(instance: ProjectType) {
    if (!instance.code) {
      instance.code = `P${Math.floor(1000000 + Math.random() * 9000000)}`;
    }
  }
}
