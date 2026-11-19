// Auto-generated types for CsWarrantyDlpClaim
// Source: src/database/models/customer-service/cs_warranty_dlp_claim.model.ts

import { DlpDefectCategory } from '../models/customer-service/cs_property_care.types';
import { DlpSeverity } from '../models/customer-service/cs_property_care.types';
import { DlpClaimStatus } from '../models/customer-service/cs_property_care.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface CsWarrantyDlpClaimAttributes {
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
  claimNo: string;
  customerName: string;
  unit: string;
  possessionDate: string;
  dlpExpiryDate: string;
  defectCategory: DlpDefectCategory;
  severity: DlpSeverity;
  assignedEngineer?: string | null;
  assignedEngineerId?: number | null;
  status: DlpClaimStatus;
  rectificationNotes?: string | null;
  signedOffAt?: Date | null;

  // Relations
  organization?: SysOrganization;
  projectDetails?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
  assignedEngineerUser?: SysUser;
}

export interface CsWarrantyDlpClaimCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  claimNo: string;
  customerName: string;
  unit: string;
  possessionDate?: string; // Has default value
  dlpExpiryDate: string;
  defectCategory?: DlpDefectCategory; // Has default value
  severity?: DlpSeverity; // Has default value
  assignedEngineer?: string | null;
  assignedEngineerId?: number | null;
  status?: DlpClaimStatus; // Has default value
  rectificationNotes?: string | null;
  signedOffAt?: Date | null;
}

export type CsWarrantyDlpClaimUpdateAttributes = Partial<CsWarrantyDlpClaimCreationAttributes>;

// Helper type for including relations
export interface CsWarrantyDlpClaimWithRelations extends CsWarrantyDlpClaimAttributes {
  organization?: SysOrganization;
  projectDetails?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
  assignedEngineerUser?: SysUser;
}
