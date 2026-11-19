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
import { SysUser } from '../system/sys_user.model';
import { VisitPurpose, VisitStatus } from './cs_communication.types';

import type { CsSiteVisitAppointmentAttributes, CsSiteVisitAppointmentCreationAttributes } from '../../types/cssitevisitappointment.types';

@Table({
  tableName: 'cs_site_visit_appointments',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_visit_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_visit_date',
      fields: ['appointment_date'],
    },
    {
      name: 'idx_cs_visit_status',
      fields: ['status'],
    },
  ],
})
export class CsSiteVisitAppointment extends TenantBaseModel<CsSiteVisitAppointmentAttributes, CsSiteVisitAppointmentCreationAttributes> {
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
    field: 'visit_no',
  })
  declare visitNo: string;

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
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare unit?: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: VisitPurpose.MILESTONE_INSPECTION,
    field: 'visit_purpose',
  })
  declare visitPurpose: VisitPurpose;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'appointment_date',
  })
  declare appointmentDate: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: '10:00 AM - 11:30 AM',
    field: 'time_slot',
  })
  declare timeSlot: string;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'assigned_escort_id',
  })
  declare assignedEscortId?: number | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'assigned_escort',
  })
  declare assignedEscort?: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'safety_ppe_required',
  })
  declare safetyPpeRequired: boolean;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: VisitStatus.SCHEDULED,
  })
  declare status: VisitStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'customer_notes',
  })
  declare customerNotes?: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'inspection_findings',
  })
  declare inspectionFindings?: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  declare checklist?: Array<{ item: string; checked: boolean; remarks?: string }> | null;

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

  @BelongsTo(() => SysUser, {
    foreignKey: 'assignedEscortId',
    as: 'escortUser',
  })
  declare escortUser?: SysUser;
}
