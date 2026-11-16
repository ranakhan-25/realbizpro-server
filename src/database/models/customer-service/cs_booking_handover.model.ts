import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { FlatLandBooking } from '../projects/flat-land-booking/pr_flat_land_booking.model';
import { CsCustomerProfile } from './cs_customer_profile.model';
import { Project } from '../projects/project/pr_project.model';
import { HandoverStatus } from './cs_handover.types';
export { HandoverStatus };
import type {
  CsBookingHandoverAttributes,
  CsBookingHandoverCreationAttributes,
} from '../../types/csbookinghandover.types';

@Table({
  tableName: 'cs_booking_handovers',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_booking_handovers_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_handover_status_deleted',
      fields: ['handover_status', 'deleted_at'],
    },
    {
      name: 'idx_cs_handover_deleted_at',
      fields: ['deleted_at'],
    },
    {
      name: 'idx_cs_handover_code',
      fields: ['handover_code'],
    },
  ],
})
export class CsBookingHandover extends TenantBaseModel<
  CsBookingHandoverAttributes,
  CsBookingHandoverCreationAttributes
> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
  })
  declare projectId?: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @ForeignKey(() => FlatLandBooking)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'booking_id',
  })
  declare bookingId?: string;

  @BelongsTo(() => FlatLandBooking, {
    foreignKey: 'bookingId',
    targetKey: 'uuid',
    as: 'booking',
  })
  declare booking?: FlatLandBooking;

  @ForeignKey(() => CsCustomerProfile)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'customer_profile_id',
  })
  declare customerProfileId?: number;

  @BelongsTo(() => CsCustomerProfile, {
    foreignKey: 'customerProfileId',
    targetKey: 'id',
    as: 'customerProfile',
  })
  declare customerProfile?: CsCustomerProfile;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    unique: true,
    field: 'handover_code',
  })
  declare handoverCode?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'customer_name',
  })
  declare customerName?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'unit_name',
  })
  declare unitName?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'project_name',
  })
  declare projectName?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'Scheduled',
    field: 'handover_status',
  })
  declare handoverStatus: HandoverStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'target_handover_date',
  })
  declare targetHandoverDate?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'readiness_percentage',
  })
  declare readinessPercentage: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'joint_inspection_done',
  })
  declare jointInspectionDone: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'possession_cert_issued',
  })
  declare possessionCertIssued: boolean;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'possession_date',
  })
  declare possessionDate?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'dlp_start_date',
  })
  declare dlpStartDate?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'dlp_expiry_date',
  })
  declare dlpExpiryDate?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'key_register_no',
  })
  declare keyRegisterNo?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'keys_delivered_count',
  })
  declare keysDeliveredCount: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'possession_cert_no',
  })
  declare possessionCertNo?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'electric_meter_reading',
  })
  declare electricMeterReading?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'gas_meter_reading',
  })
  declare gasMeterReading?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'water_meter_reading',
  })
  declare waterMeterReading?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'signed_by_customer',
  })
  declare signedByCustomer: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_snags_reported',
  })
  declare totalSnagsReported: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_snags_resolved',
  })
  declare totalSnagsResolved: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'remarks',
  })
  declare remarks?: string;
}
