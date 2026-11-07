import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Lead } from '../lead/crm-lead.model';

import type { CrmLeadNegotiationAttributes, CrmLeadNegotiationCreationAttributes } from '../../../types/crmleadnegotiation.types';

export enum CrmNegotiationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Table({
  // Reuse the CRM negotiation table already present in the application DB.
  tableName: 'crm_deal_negotiations',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class CrmLeadNegotiation extends BaseModel<CrmLeadNegotiationAttributes, CrmLeadNegotiationCreationAttributes> {
  @ForeignKey(() => Lead)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'lead_id',
  })
  declare leadId: number;
  @ForeignKey(() => Project)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'project_id',
  })
  declare projectId?: string;
  @ForeignKey(() => FlatLand)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'property_id',
  })
  declare flatLandId?: string;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    field: 'offer_price',
  })
  declare clientOfferedPrice: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    field: 'agreed_price',
  })
  declare finalAgreedPrice?: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    field: 'discount_amount',
  })
  declare discountAmount?: number;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'special_terms',
  })
  declare specialCondition?: string;
  @Column({
    type: DataType.STRING(40),
    allowNull: true,
    defaultValue: CrmNegotiationStatus.PENDING,
    field: 'approval_status',
  })
  declare status: CrmNegotiationStatus;
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

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'created_by',
    defaultValue: null,
  })
  declare createdById?: string | null;

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
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'rejection_reason',
  })
  declare rejectionReason?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'approved_by',
  })
  declare approvedById?: string;
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'approval_date',
  })
  declare approvalDate?: Date;

  // These values exist in the older follow-up API contract, but not in the
  // persisted negotiation table. Keep them virtual so Sequelize never selects
  // or writes columns that are absent from the existing schema.
  @Column(DataType.VIRTUAL)
  declare activityType?: string;
  @Column(DataType.VIRTUAL)
  declare listedPrice?: number;
  @Column(DataType.VIRTUAL)
  declare counterPrice?: number;
  @Column(DataType.VIRTUAL)
  declare discountPercent?: number;
  @Column(DataType.VIRTUAL)
  declare paymentTerm?: string;
  @Column(DataType.VIRTUAL)
  declare roundNo?: number;
  @Column(DataType.VIRTUAL)
  declare note?: string;

  @BelongsTo(() => Lead, {
    foreignKey: 'leadId',
    targetKey: 'id',
    as: 'lead',
  })
  declare lead?: Lead;
  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'code',
    as: 'project',
  })
  declare project?: Project;
  @BelongsTo(() => FlatLand, {
    foreignKey: 'flatLandId',
    targetKey: 'flatLandNo',
    as: 'flatLand',
  })
  declare flatLand?: FlatLand;
  @BelongsTo(() => SysUser, {
    foreignKey: 'createdById',
    targetKey: 'name',
    as: 'creator',
  })
  declare creator?: SysUser;
  @BelongsTo(() => SysUser, {
    foreignKey: 'approvedById',
    targetKey: 'name',
    as: 'approver',
  })
  declare approver?: SysUser;
}
