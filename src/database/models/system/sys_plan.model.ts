import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysOrganization } from './sys_organization.model';

import type { SysPlanAttributes, SysPlanCreationAttributes } from '../../types/sysplan.types';

export enum PlanBillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half_yearly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime',
}

export enum PlanStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Table({
  tableName: 'sys_plans',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['status'] },
  ],
})
export class SysPlan extends BaseModel<SysPlanAttributes, SysPlanCreationAttributes> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'name',
    comment: 'Display title of the subscription tier',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'code',
    comment: 'Unique machine identifier, e.g. PLAN_PRO',
  })
  declare code: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'description',
  })
  declare description?: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.0,
    field: 'monthly_price',
  })
  declare monthlyPrice: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.0,
    field: 'yearly_price',
  })
  declare yearlyPrice: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    defaultValue: '$',
    field: 'currency',
    comment: 'Currency symbol or ISO code, e.g. $, ৳, €, USD, BDT',
  })
  declare currency: string;

  @Column({
    type: DataType.ENUM(...Object.values(PlanBillingCycle)),
    allowNull: false,
    defaultValue: PlanBillingCycle.MONTHLY,
    field: 'billing_cycle',
  })
  declare billingCycle: PlanBillingCycle;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 30,
    field: 'duration_days',
    comment: 'Package time duration in days',
  })
  declare durationDays: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 14,
    field: 'trial_days',
    comment: 'Free trial duration before mandatory payment',
  })
  declare trialDays: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 5,
    field: 'max_users',
    comment: 'Max user accounts this org can create under this plan',
  })
  declare maxUsers: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 5,
    field: 'max_projects',
    comment: 'Max concurrent active projects permitted',
  })
  declare maxProjects: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 10240,
    field: 'max_storage_mb',
    comment: 'Data storage quota in Megabytes (10240 = 10GB)',
  })
  declare maxStorageMb: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: [],
    field: 'features',
    comment: 'JSON array of entitled feature codes or module permissions',
  })
  declare features?: any;

  @Column({
    type: DataType.ENUM(...Object.values(PlanStatus)),
    allowNull: false,
    defaultValue: PlanStatus.ACTIVE,
    field: 'status',
  })
  declare status: PlanStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'subscribers_count',
  })
  declare subscribersCount: number;

  @HasMany(() => SysOrganization, 'plan_id')
  declare organizations?: SysOrganization[];
}
