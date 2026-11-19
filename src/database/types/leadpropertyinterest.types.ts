// Auto-generated types for LeadPropertyInterest
// Source: src/database/models/crm/lead/crm-lead-property-interest.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface LeadPropertyInterestAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  leadId: number;
  projectName?: string | null;
  projectId?: string | null;
  plotFlatNo?: string | null;
  size?: string | null;
  quotedPrice?: number | null;
  clientOfferedPrice?: number | null;
  status?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  organization?: SysOrganization;
  lead?: Lead;
  project?: Project;
}

export interface LeadPropertyInterestCreationAttributes {
  leadId: number;
  projectName?: string | null;
  projectId?: string | null;
  plotFlatNo?: string | null;
  size?: string | null;
  quotedPrice?: number | null;
  clientOfferedPrice?: number | null;
  status?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type LeadPropertyInterestUpdateAttributes = Partial<LeadPropertyInterestCreationAttributes>;

// Helper type for including relations
export interface LeadPropertyInterestWithRelations extends LeadPropertyInterestAttributes {
  organization?: SysOrganization;
  lead?: Lead;
  project?: Project;
}
