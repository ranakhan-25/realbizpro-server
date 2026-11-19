// Auto-generated types for LeadArea
// Source: src/database/models/crm/lead/crm-lead-master-data.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface LeadAreaAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  city?: string | null;
  zone?: string | null;

  // Relations
  organization?: SysOrganization;
  leads?: Lead[];
  projects?: Project[];
}

export interface LeadAreaCreationAttributes {
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  city?: string | null;
  zone?: string | null;
}

export type LeadAreaUpdateAttributes = Partial<LeadAreaCreationAttributes>;

// Helper type for including relations
export interface LeadAreaWithRelations extends LeadAreaAttributes {
  organization?: SysOrganization;
  leads?: Lead[];
  projects?: Project[];
}
