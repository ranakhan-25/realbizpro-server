// Auto-generated types for CsCustomerProfile
// Source: src/database/models/customer-service/cs_customer_profile.model.ts

import { CustomerProfileStatus } from '../models/customer-service/cs_customer_profile.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CrmParty } from '../models/crm/lead/crm-party.model';
import type { CustomerAccount } from '../models/projects/contract/pr_customer_accounts.model';

export interface CsCustomerProfileAttributes {
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
  customerCode: string;
  customerName: string;
  phoneNumber: string;
  email?: string | null;
  nidNumber: string;
  tinNumber?: string | null;
  address?: string | null;
  nomineeName?: string | null;
  nomineeRelation?: string | null;
  nomineeNid?: string | null;
  customerStatus: CustomerProfileStatus;
  joinedDate: string;
  partyId?: number | null;
  customerAccountId?: number | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  party?: CrmParty;
  customerAccount?: CustomerAccount;
}

export interface CsCustomerProfileCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  customerCode: string;
  customerName: string;
  phoneNumber: string;
  email?: string | null;
  nidNumber: string;
  tinNumber?: string | null;
  address?: string | null;
  nomineeName?: string | null;
  nomineeRelation?: string | null;
  nomineeNid?: string | null;
  customerStatus?: CustomerProfileStatus; // Has default value
  joinedDate?: string; // Has default value
  partyId?: number | null;
  customerAccountId?: number | null;
}

export type CsCustomerProfileUpdateAttributes = Partial<CsCustomerProfileCreationAttributes>;

// Helper type for including relations
export interface CsCustomerProfileWithRelations extends CsCustomerProfileAttributes {
  organization?: SysOrganization;
  project?: Project;
  party?: CrmParty;
  customerAccount?: CustomerAccount;
}
