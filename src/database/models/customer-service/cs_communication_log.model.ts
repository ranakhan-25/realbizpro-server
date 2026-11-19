import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import { FlatLandBooking } from '../projects/flat-land-booking/pr_flat_land_booking.model';
import { CsCustomerProfile } from './cs_customer_profile.model';
import { CommChannel, CommType, CommStatus } from './cs_communication.types';

import type { CsCommunicationLogAttributes, CsCommunicationLogCreationAttributes } from '../../types/cscommunicationlog.types';

@Table({
  tableName: 'cs_communication_logs',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_comm_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_comm_channel',
      fields: ['channel'],
    },
    {
      name: 'idx_cs_comm_status',
      fields: ['status'],
    },
  ],
})
export class CsCommunicationLog extends TenantBaseModel<CsCommunicationLogAttributes, CsCommunicationLogCreationAttributes> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
  })
  declare projectId?: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'project_name',
  })
  declare projectName?: string | null;

  @ForeignKey(() => FlatLandBooking)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'booking_id',
  })
  declare bookingId?: string | null;

  @ForeignKey(() => CsCustomerProfile)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'customer_profile_id',
  })
  declare customerProfileId?: number | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'comm_no',
  })
  declare commNo: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'customer_name',
  })
  declare customerName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare phone?: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare email?: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare unit?: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: CommChannel.SMS,
  })
  declare channel: CommChannel;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: CommType.PAYMENT_REMINDER,
  })
  declare type: CommType;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare subject?: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: CommStatus.SENT,
  })
  declare status: CommStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'scheduled_for',
  })
  declare scheduledFor?: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'sent_at',
  })
  declare sentAt?: Date | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'sent_by',
  })
  declare sentBy?: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
  })
  declare metadata?: Record<string, any> | null;

  // Associations
  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @BelongsTo(() => FlatLandBooking, {
    foreignKey: 'bookingId',
    targetKey: 'uuid',
    as: 'booking',
  })
  declare booking?: FlatLandBooking;

  @BelongsTo(() => CsCustomerProfile, {
    foreignKey: 'customerProfileId',
    as: 'customerProfile',
  })
  declare customerProfile?: CsCustomerProfile;
}
