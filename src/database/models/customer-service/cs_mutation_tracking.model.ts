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
import type { MutationStage } from './cs_documents.types';
import type {
  CsMutationTrackingAttributes,
  CsMutationTrackingCreationAttributes,
} from '../../types/csmutationtracking.types';

@Table({
  tableName: 'cs_mutation_trackings',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_mut_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_mut_stage',
      fields: ['current_stage'],
    },
    {
      name: 'idx_cs_mut_app_no',
      fields: ['mutation_app_no'],
    },
  ],
})
export class CsMutationTracking extends TenantBaseModel<
  CsMutationTrackingAttributes,
  CsMutationTrackingCreationAttributes
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
    field: 'mut_code',
  })
  declare mutCode: string;

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
    type: DataType.STRING(100),
    allowNull: false,
    field: 'mutation_app_no',
  })
  declare mutationAppNo: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'ac_land_office',
  })
  declare acLandOffice: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'Kanungo/Surveyor Inquiry',
    field: 'current_stage',
  })
  declare currentStage: MutationStage;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'hearing_date',
  })
  declare hearingDate?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'dcr_number',
  })
  declare dcrNumber?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1170.0,
    field: 'dcr_fee_amount',
  })
  declare dcrFeeAmount: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'dcr_paid',
  })
  declare dcrPaid: boolean;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'khatian_number',
  })
  declare khatianNumber?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'remarks',
  })
  declare remarks?: string;
}
