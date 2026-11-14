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
import {
  DlpDefectCategory,
  DlpSeverity,
  DlpClaimStatus,
} from './cs_property_care.types';
import type {
  CsWarrantyDlpClaimAttributes,
  CsWarrantyDlpClaimCreationAttributes,
} from '../../types/cswarrantydlpclaim.types';

export { DlpDefectCategory, DlpSeverity, DlpClaimStatus };

@Table({
  tableName: 'cs_warranty_dlp_claims',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_dlp_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_dlp_status',
      fields: ['status'],
    },
    {
      name: 'idx_cs_dlp_severity',
      fields: ['severity'],
    },
    {
      name: 'idx_cs_dlp_claim_no',
      fields: ['claim_no'],
    },
  ],
})
export class CsWarrantyDlpClaim extends TenantBaseModel<
  CsWarrantyDlpClaimAttributes,
  CsWarrantyDlpClaimCreationAttributes
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
    type: DataType.STRING(255),
    allowNull: true,
    field: 'project_name',
  })
  declare projectName?: string;

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
    as: 'customerProfile',
  })
  declare customerProfile?: CsCustomerProfile;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'claim_no',
  })
  declare claimNo: string;

  @Column({
    type: DataType.STRING(255),
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
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'possession_date',
    defaultValue: DataType.NOW,
  })
  declare possessionDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'dlp_expiry_date',
  })
  declare dlpExpiryDate: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: DlpDefectCategory.WATER_SEEPAGE,
    field: 'defect_category',
  })
  declare defectCategory: DlpDefectCategory;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: DlpSeverity.MAJOR,
    field: 'severity',
  })
  declare severity: DlpSeverity;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'assigned_engineer',
  })
  declare assignedEngineer?: string;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'assigned_engineer_id',
  })
  declare assignedEngineerId?: number;

  @BelongsTo(() => SysUser, {
    foreignKey: 'assignedEngineerId',
    as: 'assignedEngineerUser',
  })
  declare assignedEngineerUser?: SysUser;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: DlpClaimStatus.CLAIM_LOGGED,
    field: 'status',
  })
  declare status: DlpClaimStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'rectification_notes',
  })
  declare rectificationNotes?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'signed_off_at',
  })
  declare signedOffAt?: Date;
}
