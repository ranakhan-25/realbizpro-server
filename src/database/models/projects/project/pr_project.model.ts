import {
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';

import {
  ProjectAttributes,
  ProjectCreationAttributes,
  ProjectUpdateAttributes,
} from 'src/database/types/project.types';

import { ShareConfiguration } from '../investor/configuration.model';
import { BaseModel } from 'src/database/base.model';
import { Site } from '../project-site/pr_project_site.model';
import { MaterialRequisition } from '../material-requisition/pr_material_requisition.model';
import { ProjectDocument } from '../project-document/pr_project_document.model';
import { ProjectShareAssignment } from '../project-share-assignment/pr_project_share_assignment.model';
import { ProjectShareConfiguration } from '../project-share-configuration/pr_project_share_configuration.model';
import { FlatLand } from '../flatland/pr_flatland.model';
import { LandInfrastructure } from '../land-infrastructure/pr_land_infrastructure.model';
import { FlatLandBooking } from '../flat-land-booking/pr_flat_land_booking.model';
import { FlatLandOffer } from '../flat-land-offer/pr_flat_land_offer.model';
import { ProjectBillingRecord } from '../billing/pr_project_billing_record.model';
import { ProjectTeamMember } from '../project-team-member/pr_project_team_member.model';
import { Boq } from '../boq/pr_boq.model';
import { Invoice } from '../billing/pr_invoice.model';
import { WorkOrder } from '../billing/work-order/pr_work_order.model';
import { ProcurementRfq } from '../../procurement/rfq/pr_rfq.model';
import { ProcurementAssetRfq } from '../../procurement/rfq/pr_asset_rfq.model';
import { ProcurementMaterialRequisition } from '../../procurement/requisition/pr_material_requisition.model';
import { ProcurementAssetRequisition } from '../../procurement/requisition/pr_asset_requisition.model';
import { ProcurementPurchaseOrder } from '../../procurement/purchase-order/pr_purchase_order.model';
import { ProcurementAssetPurchaseOrder } from '../../procurement/purchase-order/pr_asset_purchase_order.model';
import { ProcurementGrn } from '../../procurement/grn/pr_grn.model';
import { ProcurementAssetGrn } from '../../procurement/grn/pr_asset_grn.model';
import { ProcurementPurchaseBill } from '../../procurement/purchase-bill/pr_purchase_bill.model';
import { ProcurementAssetPurchaseBill } from '../../procurement/purchase-bill/pr_asset_purchase_bill.model';
import { ProcurementBoq } from '../../procurement/boq/pr_procurement_boq.model';
import { ProcurementWorkOrder } from '../../procurement/work-order/pr_procurement_work_order.model';
import { ProcurementWorkOrderMeasurement } from '../../procurement/work-order/pr_work_order_measurement.model';
import { ProcurementWorkBill } from '../../procurement/work-order/pr_work_bill.model';
import { ProcurementHireOrder } from '../../procurement/equipment-hire/pr_hire_order.model';
import { ProcurementHireBill } from '../../procurement/equipment-hire/pr_hire_bill.model';
import { ProjectType } from '../project-type/pr_project_type.model';
import { LeadArea } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CrmLeadPipeline } from 'src/database/models/crm/lead/crm-lead-pipeline.model';
import { LeadPropertyInterest } from 'src/database/models/crm/lead/crm-lead-property-interest.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { CrmLeadNegotiation } from 'src/database/models/crm/call-center/crm-lead-negotiation.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  INACTIVE = 'INACTIVE',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

@Table({
  tableName: 'project',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Project_name_idx',
      fields: ['name'],
    },
    {
      name: 'Project_uuid_idx',
      fields: ['uuid'],
      unique: true,
    },
  ],
})
export class Project
  extends BaseModel<
    ProjectUpdateAttributes,
    ProjectCreationAttributes
  >
  implements ProjectAttributes
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

  @ForeignKey(() => ProjectType)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare projectType?: string;

  @BelongsTo(() => ProjectType, { foreignKey: 'projectType', targetKey: 'uuid', as: 'type' })
  declare type?: ProjectType;

  @ForeignKey(() => LeadArea)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare areaCategory?: string;

  @BelongsTo(() => LeadArea, { foreignKey: 'areaCategory', targetKey: 'uuid', as: 'area' })
  declare area?: LeadArea;

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

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare startDate?: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare endDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare contactPersonName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare contactPhone?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare clientEmail?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare contractorCompany?: string;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectManager?: string;

  @BelongsTo(() => SysUser, { foreignKey: 'projectManager', targetKey: 'uuid', as: 'manager' })
  declare manager?: SysUser;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  declare totalBudget?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare numberOfStoreys?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  })
  declare progressPercentage?: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ProjectStatus),
    ),
    allowNull: false,
    defaultValue: ProjectStatus.ACTIVE,
  })
  declare status: ProjectStatus;

  @HasMany(() => Site, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare sites?: Site[];

  @HasMany(() => ShareConfiguration, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
  })
  declare shareConfigurations?: ShareConfiguration[];

  @HasMany(() => MaterialRequisition, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'materialRequisitions',
  })
  declare materialRequisitions?: MaterialRequisition[];

  @HasMany(() => ProjectDocument, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'documents',
  })
  declare documents?: ProjectDocument[];

  @HasMany(() => ProjectShareAssignment, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'shareAssignments',
  })
  declare shareAssignments?: ProjectShareAssignment[];

  @HasMany(() => ProjectShareConfiguration, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'projectShareConfigurations',
  })
  declare projectShareConfigurations?: ProjectShareConfiguration[];

  @HasMany(() => FlatLand, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'flatLandItems',
  })
  declare flatLandItems?: FlatLand[];

  @HasMany(() => LandInfrastructure, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'landInfrastructure',
  })
  declare landInfrastructure?: LandInfrastructure[];

  @HasMany(() => FlatLandBooking, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'flatLandBookings',
  })
  declare flatLandBookings?: FlatLandBooking[];

  @HasMany(() => FlatLandOffer, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'flatLandOffers',
  })
  declare flatLandOffers?: FlatLandOffer[];

  @HasMany(() => ProjectBillingRecord, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'billingRecords',
  })
  declare billingRecords?: ProjectBillingRecord[];

  @HasMany(() => ProjectTeamMember, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'teamMembers',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare teamMembers?: ProjectTeamMember[];

  @HasMany(() => Invoice, {
    foreignKey: 'projectTypeId',
    sourceKey: 'uuid',
    as: 'invoices',
  })
  declare invoices?: Invoice[];

  @HasMany(() => Boq, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'boqs',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare boqs: Boq[];
  @HasMany(() => WorkOrder, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
    as: 'workOrders',
  })
  declare workOrders?: WorkOrder[];

  @HasMany(() => ProcurementRfq, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementRfqs',
  })
  declare procurementRfqs?: ProcurementRfq[];
  @HasMany(() => ProcurementAssetRfq, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementAssetRfqs',
  })
  declare procurementAssetRfqs?: ProcurementAssetRfq[];
  @HasMany(() => ProcurementMaterialRequisition, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementMaterialRequisitions',
  })
  declare procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  @HasMany(() => ProcurementAssetRequisition, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementAssetRequisitions',
  })
  declare procurementAssetRequisitions?: ProcurementAssetRequisition[];
  @HasMany(() => ProcurementPurchaseOrder, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementPurchaseOrders',
  })
  declare procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  @HasMany(() => ProcurementAssetPurchaseOrder, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementAssetPurchaseOrders',
  })
  declare procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  @HasMany(() => ProcurementGrn, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementGrns',
  })
  declare procurementGrns?: ProcurementGrn[];
  @HasMany(() => ProcurementPurchaseBill, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementPurchaseBills',
  })
  declare procurementPurchaseBills?: ProcurementPurchaseBill[];
  @HasMany(() => ProcurementAssetGrn, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementAssetGrns',
  })
  declare procurementAssetGrns?: ProcurementAssetGrn[];
  @HasMany(() => ProcurementAssetPurchaseBill, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementAssetPurchaseBills',
  })
  declare procurementAssetPurchaseBills?: ProcurementAssetPurchaseBill[];
  @HasMany(() => ProcurementBoq, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'procurementBoqs',
  })
  declare procurementBoqs?: ProcurementBoq[];
  @HasMany(() => ProcurementWorkOrder, { foreignKey: 'project_id', sourceKey: 'uuid', as: 'procurementWorkOrders' })
  declare procurementWorkOrders?: ProcurementWorkOrder[];
  @HasMany(() => ProcurementWorkOrderMeasurement, { foreignKey: 'project_id', sourceKey: 'uuid', as: 'procurementWorkOrderMeasurements' })
  declare procurementWorkOrderMeasurements?: ProcurementWorkOrderMeasurement[];
  @HasMany(() => ProcurementWorkBill, { foreignKey: 'project_id', sourceKey: 'uuid', as: 'procurementWorkBills' })
  declare procurementWorkBills?: ProcurementWorkBill[];
  @HasMany(() => ProcurementHireOrder, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'equipmentHireOrders',
  })
  declare equipmentHireOrders?: ProcurementHireOrder[];
  @HasMany(() => ProcurementHireBill, {
    foreignKey: 'project_id',
    sourceKey: 'uuid',
    as: 'equipmentHireBills',
  })
  declare equipmentHireBills?: ProcurementHireBill[];

  @HasMany(() => CrmLeadPipeline, { foreignKey: 'projectId', sourceKey: 'uuid', as: 'crmPipelines' })
  declare crmPipelines?: CrmLeadPipeline[];

  @HasMany(() => LeadPropertyInterest, { foreignKey: 'projectId', sourceKey: 'uuid', as: 'crmLeadInterests' })
  declare crmLeadInterests?: LeadPropertyInterest[];

  @HasMany(() => Lead, { foreignKey: 'projectId', sourceKey: 'uuid', as: 'crmLeads' })
  declare crmLeads?: Lead[];

  @HasMany(() => CrmLeadNegotiation, { foreignKey: 'projectId', sourceKey: 'code', as: 'crmNegotiations' })
  declare crmNegotiations?: CrmLeadNegotiation[];

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
  declare updatedBy?: string;

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
