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
  SurveyType,
  NpsCategory,
  FeedbackFollowUpStatus,
} from './cs_communication.types';

import type { CsCustomerFeedbackAttributes, CsCustomerFeedbackCreationAttributes } from '../../types/cscustomerfeedback.types';

@Table({
  tableName: 'cs_customer_feedbacks',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_fb_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_fb_type',
      fields: ['survey_type'],
    },
    {
      name: 'idx_cs_fb_nps_cat',
      fields: ['nps_category'],
    },
    {
      name: 'idx_cs_fb_followup',
      fields: ['follow_up_status'],
    },
  ],
})
export class CsCustomerFeedback extends TenantBaseModel<CsCustomerFeedbackAttributes, CsCustomerFeedbackCreationAttributes> {
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
    field: 'feedback_no',
  })
  declare feedbackNo: string;

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
    defaultValue: SurveyType.HANDOVER_CSAT,
    field: 'survey_type',
  })
  declare surveyType: SurveyType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 5,
    field: 'csat_score',
  })
  declare csatScore: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 10,
    field: 'nps_score',
  })
  declare npsScore: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: NpsCategory.PROMOTER,
    field: 'nps_category',
  })
  declare npsCategory: NpsCategory;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare comments?: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: FeedbackFollowUpStatus.PENDING_REVIEW,
    field: 'follow_up_status',
  })
  declare followUpStatus: FeedbackFollowUpStatus;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'assigned_officer_id',
  })
  declare assignedOfficerId?: number | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'assigned_officer',
  })
  declare assignedOfficer?: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'action_notes',
  })
  declare actionNotes?: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'submitted_at',
  })
  declare submittedAt: Date;

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
    foreignKey: 'assignedOfficerId',
    as: 'officerUser',
  })
  declare officerUser?: SysUser;
}
