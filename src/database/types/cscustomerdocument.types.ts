// Auto-generated types for CsCustomerDocument
// Source: src/database/models/customer-service/cs_customer_document.model.ts

import { DocumentCategory } from '../models/customer-service/cs_documents.types';
import { DocumentVerificationStatus } from '../models/customer-service/cs_documents.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface CsCustomerDocumentAttributes {
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
  bookingId?: string | null;
  customerProfileId?: number | null;
  docCode: string;
  docTitle: string;
  docCategory: DocumentCategory;
  customerName: string;
  unitName?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  fileUrl?: string | null;
  fileKey?: string | null;
  uploadDate: string;
  verificationStatus: DocumentVerificationStatus;
  verifiedBy?: number | null;
  verifiedAt?: Date | null;
  notes?: string | null;

  // Relations
  organization?: SysOrganization;
  projectDetails?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
  verifier?: SysUser;
}

export interface CsCustomerDocumentCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  docCode: string;
  docTitle: string;
  docCategory?: DocumentCategory; // Has default value
  customerName: string;
  unitName?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  fileUrl?: string | null;
  fileKey?: string | null;
  uploadDate?: string; // Has default value
  verificationStatus?: DocumentVerificationStatus; // Has default value
  verifiedBy?: number | null;
  verifiedAt?: Date | null;
  notes?: string | null;
}

export type CsCustomerDocumentUpdateAttributes = Partial<CsCustomerDocumentCreationAttributes>;

// Helper type for including relations
export interface CsCustomerDocumentWithRelations extends CsCustomerDocumentAttributes {
  organization?: SysOrganization;
  projectDetails?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
  verifier?: SysUser;
}
