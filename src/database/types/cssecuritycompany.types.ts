// Auto-generated types for CsSecurityCompany
// Source: src/database/models/customer-service/cs_security_company.model.ts

import { SecurityCompanyStatus } from '../models/customer-service/cs_security.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsSecurityGuard } from '../models/customer-service/cs_security_guard.model';

export interface CsSecurityCompanyAttributes {
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
  contactPerson: string;
  phone: string;
  email?: string | null;
  contractStart: string;
  contractEnd: string;
  monthlyCost: number;
  liabilityNote: string;
  status: SecurityCompanyStatus;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  guards?: CsSecurityGuard[];
}

export interface CsSecurityCompanyCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string | null;
  contractStart: string;
  contractEnd: string;
  monthlyCost?: number; // Has default value
  liabilityNote?: string; // Has default value
  status?: SecurityCompanyStatus; // Has default value
}

export type CsSecurityCompanyUpdateAttributes = Partial<CsSecurityCompanyCreationAttributes>;

// Helper type for including relations
export interface CsSecurityCompanyWithRelations extends CsSecurityCompanyAttributes {
  organization?: SysOrganization;
  project?: Project;
  guards?: CsSecurityGuard[];
}
