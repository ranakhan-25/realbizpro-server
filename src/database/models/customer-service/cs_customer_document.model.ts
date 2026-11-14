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
import { SysUser } from '../system/sys_user.model';
import type {
  DocumentCategory,
  DocumentVerificationStatus,
} from './cs_documents.types';
import type {
  CsCustomerDocumentAttributes,
  CsCustomerDocumentCreationAttributes,
} from '../../types/cscustomerdocument.types';

@Table({
  tableName: 'cs_customer_documents',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_docs_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_docs_category',
      fields: ['doc_category'],
    },
    {
      name: 'idx_cs_docs_status',
      fields: ['verification_status'],
    },
  ],
})
export class CsCustomerDocument extends TenantBaseModel<
  CsCustomerDocumentAttributes,
  CsCustomerDocumentCreationAttributes
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
    field: 'doc_code',
  })
  declare docCode: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'doc_title',
  })
  declare docTitle: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'Sale Agreement (Baina)',
    field: 'doc_category',
  })
  declare docCategory: DocumentCategory;

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
    field: 'file_name',
  })
  declare fileName?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'file_size',
  })
  declare fileSize?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'file_url',
  })
  declare fileUrl?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'file_key',
  })
  declare fileKey?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'upload_date',
  })
  declare uploadDate: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'Pending Vetting',
    field: 'verification_status',
  })
  declare verificationStatus: DocumentVerificationStatus;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'verified_by',
  })
  declare verifiedBy?: number;

  @BelongsTo(() => SysUser, {
    foreignKey: 'verifiedBy',
    targetKey: 'id',
    as: 'verifier',
  })
  declare verifier?: SysUser;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'verified_at',
  })
  declare verifiedAt?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  declare notes?: string;
}
