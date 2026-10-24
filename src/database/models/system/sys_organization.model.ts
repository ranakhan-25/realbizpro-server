import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysPlan } from './sys_plan.model';
import { SysUser } from './sys_user.model';
import { SysOrgEntitlement } from './sys_org_entitlement.model';

import type { SysOrganizationAttributes, SysOrganizationCreationAttributes } from '../../types/sysorganization.types';

export enum OrgSubscriptionStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  EXPIRED = 'expired',
  LOCKED = 'locked',
  CANCELED = 'canceled',
}

@Table({
  tableName: 'sys_organizations',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['subscription_status'] },
    { fields: ['plan_id'] },
  ],
})
export class SysOrganization extends BaseModel<SysOrganizationAttributes, SysOrganizationCreationAttributes> {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'name',
    comment: 'Company or Organization Legal Name',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'code',
    comment: 'Tenant unique code identifier, e.g. ORG-1001',
  })
  declare code: string;

  @Column({
    type: DataType.STRING(120),
    allowNull: true,
    field: 'email',
  })
  declare email?: string;

  @Column({
    type: DataType.STRING(40),
    allowNull: true,
    field: 'phone',
  })
  declare phone?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'address',
  })
  declare address?: string;

  @ForeignKey(() => SysPlan)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'plan_id',
  })
  declare planId?: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'plan_uuid',
  })
  declare planUuid?: string;

  @Column({
    type: DataType.ENUM(...Object.values(OrgSubscriptionStatus)),
    allowNull: false,
    defaultValue: OrgSubscriptionStatus.TRIAL,
    field: 'subscription_status',
  })
  declare subscriptionStatus: OrgSubscriptionStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'subscription_start_date',
  })
  declare subscriptionStartDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'subscription_end_date',
  })
  declare subscriptionEndDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'trial_ends_at',
  })
  declare trialEndsAt?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 5,
    field: 'max_users',
    comment: 'Snapshot or customized maximum user limit for this tenant',
  })
  declare maxUsers: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 5,
    field: 'max_projects',
  })
  declare maxProjects: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 10240,
    field: 'max_storage_mb',
    comment: 'Total storage limit in MB allocated to this tenant',
  })
  declare maxStorageMb: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_locked',
    comment: 'Manual admin suspension or automatic lockout flag',
  })
  declare isLocked: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'lock_reason',
  })
  declare lockReason?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'metadata',
  })
  declare metadata?: any;

  @BelongsTo(() => SysPlan, 'plan_id')
  declare plan?: SysPlan;

  @HasMany(() => SysUser, 'org_id')
  declare users?: SysUser[];

  @HasMany(() => SysOrgEntitlement, 'org_id')
  declare entitlements?: SysOrgEntitlement[];
}
