import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Lead } from './crm-lead.model';

import type {
  LeadTransferLogAttributes,
  LeadTransferLogCreationAttributes,
} from '../../../types/leadtransferlog.types';

@Table({
  tableName: 'crm_lead_transfer_logs',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class LeadTransferLog extends BaseModel<
  LeadTransferLogAttributes,
  LeadTransferLogCreationAttributes
> {
  @ForeignKey(() => Lead)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'lead_id',
  })
  declare leadId: number;
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'transferred_from',
  })
  declare transferredFrom: string;
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'transferred_to',
  })
  declare transferredTo: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'transfer_reason',
  })
  declare transferReason?: string;
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'transfer_date',
  })
  declare transferDate: Date;
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'approved_by',
  })
  declare approvedBy?: string;
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'transfer_type',
  })
  declare transferType?: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare followup: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'manual_set',
  })
  declare manualSet: boolean;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'assigned_quantity',
  })
  declare assignedQuantity?: number;
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
    type: DataType.STRING,
    allowNull: true,
    field: 'project_id',
  })
  declare projectId?: string;

  @BelongsTo(() => Lead, {
    foreignKey: 'leadId',
    targetKey: 'id',
    as: 'lead',
  })
  declare lead?: Lead;
  @BelongsTo(() => SysUser, {
    foreignKey: 'transferredFrom',
    targetKey: 'uuid',
    as: 'sourceUser',
  })
  declare sourceUser?: SysUser;
  @BelongsTo(() => SysUser, {
    foreignKey: 'transferredTo',
    targetKey: 'uuid',
    as: 'targetUser',
  })
  declare targetUser?: SysUser;
  @BelongsTo(() => SysUser, {
    foreignKey: 'approvedBy',
    targetKey: 'uuid',
    as: 'approver',
  })
  declare approver?: SysUser;
}
