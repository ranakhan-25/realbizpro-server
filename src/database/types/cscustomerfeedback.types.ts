// Auto-generated types for CsCustomerFeedback
// Source: src/database/models/customer-service/cs_customer_feedback.model.ts

import { SurveyType } from '../models/customer-service/cs_communication.types';
import { NpsCategory } from '../models/customer-service/cs_communication.types';
import { FeedbackFollowUpStatus } from '../models/customer-service/cs_communication.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface CsCustomerFeedbackAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  feedbackNo: string;
  customerName: string;
  phone?: string | null;
  unit?: string | null;
  surveyType: SurveyType;
  csatScore: number;
  npsScore: number;
  npsCategory: NpsCategory;
  comments?: string | null;
  followUpStatus: FeedbackFollowUpStatus;
  assignedOfficerId?: number | null;
  assignedOfficer?: string | null;
  actionNotes?: string | null;
  submittedAt: Date;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
  officerUser?: SysUser;
}

export interface CsCustomerFeedbackCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  feedbackNo: string;
  customerName: string;
  phone?: string | null;
  unit?: string | null;
  surveyType?: SurveyType; // Has default value
  csatScore?: number; // Has default value
  npsScore?: number; // Has default value
  npsCategory?: NpsCategory; // Has default value
  comments?: string | null;
  followUpStatus?: FeedbackFollowUpStatus; // Has default value
  assignedOfficerId?: number | null;
  assignedOfficer?: string | null;
  actionNotes?: string | null;
  submittedAt?: Date; // Has default value
}

export type CsCustomerFeedbackUpdateAttributes = Partial<CsCustomerFeedbackCreationAttributes>;

// Helper type for including relations
export interface CsCustomerFeedbackWithRelations extends CsCustomerFeedbackAttributes {
  organization?: SysOrganization;
  project?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
  officerUser?: SysUser;
}
