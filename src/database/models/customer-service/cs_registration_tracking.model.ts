import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { CsCustomerProfile } from './cs_customer_profile.model';
import { FlatLandBooking } from '../projects/flat-land-booking/pr_flat_land_booking.model';
import { Project } from '../projects/project/pr_project.model';
import type {
  DeedDraftStatus,
  RegistrationStatus,
} from './cs_documents.types';
import type {
  CsRegistrationTrackingAttributes,
  CsRegistrationTrackingCreationAttributes,
} from '../../types/csregistrationtracking.types';

@Table({
  tableName: 'cs_registration_trackings',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_reg_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_reg_status',
      fields: ['status'],
    },
  ],
})
export class CsRegistrationTracking extends TenantBaseModel<
  CsRegistrationTrackingAttributes,
  CsRegistrationTrackingCreationAttributes
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
    as: 'projectDetails',
  })
  declare projectDetails?: Project;

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
    allowNull: false,
    unique: true,
    field: 'reg_code',
  })
  declare regCode: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'customer_name',
  })
  declare customerName: string;

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
    type: DataType.STRING(255),
    allowNull: false,
    field: 'sub_registrar_office',
  })
  declare subRegistrarOffice: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'Draft Ready',
    field: 'deed_draft_status',
  })
  declare deedDraftStatus: DeedDraftStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'registration_date_scheduled',
  })
  declare registrationDateScheduled?: string;

  @Column({
    type: DataType.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_govt_fees',
  })
  declare totalGovtFees: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'fee_receipt_collected',
  })
  declare feeReceiptCollected: boolean;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'registered_deed_no',
  })
  declare registeredDeedNo?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'Documents Gathering',
    field: 'status',
  })
  declare status: RegistrationStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'delivered_date',
  })
  declare deliveredDate?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'remarks',
  })
  declare remarks?: string;
}
