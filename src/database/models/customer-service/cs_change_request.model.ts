import {
  BeforeValidate,
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
  CsChangeRequestAttributes,
  CsChangeRequestCreationAttributes,
} from '../../types/cschangerequest.types';

export enum ChangeRequestType {
  OWNERSHIP_TRANSFER = 'Ownership Transfer',
  RESALE = 'Resale',
  CANCELLATION_REFUND = 'Cancellation & Refund',
  UNIT_SWAP = 'Unit Swap',
}

export enum ChangeRequestStatus {
  DRAFT = 'Draft',
  LEGAL_VERIFICATION = 'Legal Verification',
  HOD_APPROVAL = 'HOD Approval',
  ACCOUNTS_CLEARANCE = 'Accounts Clearance',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected',
}

@Table({
  tableName: 'cs_change_requests',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_change_requests_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_cr_code',
      fields: ['request_code'],
      unique: true,
    },
    {
      name: 'idx_cs_cr_status_deleted',
      fields: ['status', 'deleted_at'],
    },
    {
      name: 'idx_cs_cr_type_deleted',
      fields: ['request_type', 'deleted_at'],
    },
    {
      name: 'idx_cs_cr_deleted_at',
      fields: ['deleted_at'],
    },
    {
      name: 'idx_cs_cr_customer_profile_id',
      fields: ['customer_profile_id'],
    },
  ],
})
export class CsChangeRequest extends TenantBaseModel<
  CsChangeRequestAttributes,
  CsChangeRequestCreationAttributes
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
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'request_code',
  })
  declare requestCode: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'request_type',
  })
  declare requestType: ChangeRequestType;

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
    type: DataType.STRING(150),
    allowNull: false,
    field: 'customer_name',
  })
  declare customerName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'unit',
  })
  declare unit: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    field: 'project',
  })
  declare project?: string;

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
    type: DataType.TEXT,
    allowNull: true,
    field: 'reason',
  })
  declare reason?: string;

  @Column({
    type: DataType.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'transfer_fee',
  })
  declare transferFee: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    field: 'new_buyer_name',
  })
  declare newBuyerName?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'new_buyer_nid',
  })
  declare newBuyerNid?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'new_buyer_phone',
  })
  declare newBuyerPhone?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue:
      ChangeRequestStatus.LEGAL_VERIFICATION,
    field: 'status',
  })
  declare status: ChangeRequestStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'applied_date',
  })
  declare appliedDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'approval_notes',
  })
  declare approvalNotes?: string;

  @BeforeValidate
  static generateRequestCode(
    instance: CsChangeRequest,
  ) {
    if (!instance.requestCode) {
      instance.requestCode = `CR-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }
}
