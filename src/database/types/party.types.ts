// Auto-generated types for Party
// Source: src/database/models/procurement/parties/party.model.ts

import { PartyType } from '../models/procurement/parties/party.model';
import { PartyBusinessType } from '../models/procurement/parties/party.model';
import { PartyStatus } from '../models/procurement/parties/party.model';

import type { PartyDocument } from '../models/procurement/parties/party-document.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface PartyAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  type: PartyType;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  whatsapp?: string | null;
  tradeLicenseNo?: string | null;
  tradeLicenseExpiry?: string | null;
  nidNo?: string | null;
  tinNo?: string | null;
  binNo?: string | null;
  ownerName?: string | null;
  businessType?: PartyBusinessType | null;
  bankName?: string | null;
  accountNo?: string | null;
  branch?: string | null;
  accountingGroup?: string | null;
  payableAccount?: string | null;
  notes?: string | null;
  status: PartyStatus;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  documents?: PartyDocument[];
  organization?: SysOrganization;
  project?: Project;
}

export interface PartyCreationAttributes {
  code: string;
  name: string;
  type: PartyType;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean; // Has default value
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  whatsapp?: string | null;
  tradeLicenseNo?: string | null;
  tradeLicenseExpiry?: string | null;
  nidNo?: string | null;
  tinNo?: string | null;
  binNo?: string | null;
  ownerName?: string | null;
  businessType?: PartyBusinessType | null;
  bankName?: string | null;
  accountNo?: string | null;
  branch?: string | null;
  accountingGroup?: string | null;
  payableAccount?: string | null;
  notes?: string | null;
  status?: PartyStatus; // Has default value
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type PartyUpdateAttributes = Partial<PartyCreationAttributes>;

// Helper type for including relations
export interface PartyWithRelations extends PartyAttributes {
  documents?: PartyDocument[];
  organization?: SysOrganization;
  project?: Project;
}
