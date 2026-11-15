import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { CsBookingHandover } from './cs_booking_handover.model';
import { FlatLandBooking } from '../projects/flat-land-booking/pr_flat_land_booking.model';
import { Project } from '../projects/project/pr_project.model';
import { SnagSeverity, SnagStatus } from './cs_handover.types';
export { SnagSeverity, SnagStatus };
import type {
  CsHandoverSnagAttributes,
  CsHandoverSnagCreationAttributes,
} from '../../types/cshandoversnag.types';

@Table({
  tableName: 'cs_handover_snags',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_snags_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_snags_status',
      fields: ['status'],
    },
    {
      name: 'idx_cs_snags_handover_id',
      fields: ['handover_id'],
    },
  ],
})
export class CsHandoverSnag extends TenantBaseModel<
  CsHandoverSnagAttributes,
  CsHandoverSnagCreationAttributes
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

  @ForeignKey(() => CsBookingHandover)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'handover_id',
  })
  declare handoverId?: number;

  @BelongsTo(() => CsBookingHandover, {
    foreignKey: 'handoverId',
    targetKey: 'id',
    as: 'handover',
  })
  declare handover?: CsBookingHandover;

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

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'snag_code',
  })
  declare snagCode: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'unit_name',
  })
  declare unitName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'customer_name',
  })
  declare customerName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'defect_location',
  })
  declare defectLocation: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'description',
  })
  declare description: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'Minor',
    field: 'severity',
  })
  declare severity: SnagSeverity;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'assigned_contractor',
  })
  declare assignedContractor?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'target_rectification_date',
  })
  declare targetRectificationDate?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'Reported',
    field: 'status',
  })
  declare status: SnagStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'rectified_date',
  })
  declare rectifiedDate?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'remarks',
  })
  declare remarks?: string;
}
