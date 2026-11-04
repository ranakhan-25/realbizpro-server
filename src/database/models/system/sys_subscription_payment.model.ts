import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysOrganization } from './sys_organization.model';
import { SysPlan } from './sys_plan.model';
import { SysUser } from './sys_user.model';

export enum SubscriptionPaymentStatus {
  PENDING = 'PENDING',
  VALID = 'VALID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

@Table({
  tableName: 'sys_subscription_payments',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['tran_id'], unique: true },
    { fields: ['val_id'] },
    { fields: ['organization_id'] },
    { fields: ['plan_id'] },
    { fields: ['status'] },
  ],
})
export class SysSubscriptionPayment extends BaseModel {
  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'organization_id',
  })
  declare organizationId: number;

  @ForeignKey(() => SysPlan)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'plan_id',
  })
  declare planId: number;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    field: 'tran_id',
  })
  declare tranId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'val_id',
  })
  declare valId?: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    field: 'amount',
  })
  declare amount: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    defaultValue: 'BDT',
    field: 'currency',
  })
  declare currency: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'monthly',
    field: 'billing_cycle',
  })
  declare billingCycle: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 30,
    field: 'duration_days',
  })
  declare durationDays: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: SubscriptionPaymentStatus.PENDING,
    field: 'status',
  })
  declare status: SubscriptionPaymentStatus;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'bank_tran_id',
  })
  declare bankTranId?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'card_type',
  })
  declare cardType?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'card_brand',
  })
  declare cardBrand?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'gateway_response',
  })
  declare gatewayResponse?: any;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'payment_initiated_at',
  })
  declare paymentInitiatedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'payment_completed_at',
  })
  declare paymentCompletedAt?: Date;

  @BelongsTo(() => SysOrganization, {
    foreignKey: 'organization_id',
    as: 'organization',
  })
  declare organization?: SysOrganization;

  @BelongsTo(() => SysPlan, {
    foreignKey: 'plan_id',
    as: 'plan',
  })
  declare plan?: SysPlan;

  @BelongsTo(() => SysUser, {
    foreignKey: 'user_id',
    as: 'user',
  })
  declare user?: SysUser;
}
