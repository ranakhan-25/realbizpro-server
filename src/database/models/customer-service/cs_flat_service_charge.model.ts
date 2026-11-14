import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import type {
  CsFlatServiceChargeAttributes,
  CsFlatServiceChargeCreationAttributes,
} from '../../types/csflatservicecharge.types';
import type { ServiceChargePaymentStatus } from './cs_service_charge.types';

@Table({
  tableName: 'cs_flat_service_charges',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_flat_sc_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_flat_sc_proj_flat_month',
      fields: ['project_id', 'flat_number', 'billing_month'],
      unique: true,
      where: {
        deleted_at: null,
      },
    },
    {
      name: 'idx_cs_flat_sc_proj_month_status',
      fields: ['project_id', 'billing_month', 'payment_status'],
    },
  ],
})
export class CsFlatServiceCharge extends TenantBaseModel<
  CsFlatServiceChargeAttributes,
  CsFlatServiceChargeCreationAttributes
> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'project_id',
  })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'flat_number',
  })
  declare flatNumber: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'resident_name',
  })
  declare residentName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'resident_phone',
  })
  declare residentPhone?: string | null;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 1500.0,
    field: 'flat_size_sqft',
  })
  declare flatSizeSqft: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'billing_month',
  })
  declare billingMonth: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'rate_applied',
  })
  declare rateApplied: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_amount',
  })
  declare totalAmount: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'paid_amount',
  })
  declare paidAmount: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'DUE',
    field: 'payment_status',
  })
  declare paymentStatus: ServiceChargePaymentStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'due_date',
  })
  declare dueDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'payment_date',
  })
  declare paymentDate?: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'payment_method',
  })
  declare paymentMethod?: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'reference_number',
  })
  declare referenceNumber?: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  declare notes?: string | null;
}

