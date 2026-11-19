// Auto-generated types for CsSecurityGuard
// Source: src/database/models/customer-service/cs_security_guard.model.ts

import { GuardSource } from '../models/customer-service/cs_security.types';
import { GuardStatus } from '../models/customer-service/cs_security.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsSecurityCompany } from '../models/customer-service/cs_security_company.model';
import type { CsSecurityRoster } from '../models/customer-service/cs_security_roster.model';

export interface CsSecurityGuardAttributes {
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
  name: string;
  phone: string;
  nationalId: string;
  source: GuardSource;
  companyId?: number | null;
  badgeNumber?: string | null;
  status: GuardStatus;
  joinedDate: string;
  emergencyContact?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  company?: CsSecurityCompany;
  rosters?: CsSecurityRoster[];
}

export interface CsSecurityGuardCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  name: string;
  phone: string;
  nationalId: string;
  source: GuardSource;
  companyId?: number | null;
  badgeNumber?: string | null;
  status?: GuardStatus; // Has default value
  joinedDate: string;
  emergencyContact?: string | null;
}

export type CsSecurityGuardUpdateAttributes = Partial<CsSecurityGuardCreationAttributes>;

// Helper type for including relations
export interface CsSecurityGuardWithRelations extends CsSecurityGuardAttributes {
  organization?: SysOrganization;
  project?: Project;
  company?: CsSecurityCompany;
  rosters?: CsSecurityRoster[];
}
