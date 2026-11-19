// Auto-generated types for LeadTeam
// Source: src/database/models/crm/lead/crm-lead-master-data.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { LeadTeamMember } from '../models/crm/lead/crm-lead-team-member.model';

export interface LeadTeamAttributes {
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
  leaderId?: string | null;
  department?: string | null;
  isActive?: boolean | null;

  // Relations
  organization?: SysOrganization;
  leader?: SysUser;
  members?: LeadTeamMember[];
}

export interface LeadTeamCreationAttributes {
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  leaderId?: string | null;
  department?: string | null;
  isActive?: boolean | null;
}

export type LeadTeamUpdateAttributes = Partial<LeadTeamCreationAttributes>;

// Helper type for including relations
export interface LeadTeamWithRelations extends LeadTeamAttributes {
  organization?: SysOrganization;
  leader?: SysUser;
  members?: LeadTeamMember[];
}
