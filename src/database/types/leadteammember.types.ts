// Auto-generated types for LeadTeamMember
// Source: src/database/models/crm/lead/crm-lead-team-member.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { LeadTeam } from '../models/crm/lead/crm-lead-master-data.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface LeadTeamMemberAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  teamId: number;
  userId: string;
  roleInTeam?: string | null;
  isActive?: boolean | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  team?: LeadTeam;
  user?: SysUser;
}

export interface LeadTeamMemberCreationAttributes {
  teamId: number;
  userId: string;
  roleInTeam?: string | null;
  isActive?: boolean | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type LeadTeamMemberUpdateAttributes = Partial<LeadTeamMemberCreationAttributes>;

// Helper type for including relations
export interface LeadTeamMemberWithRelations extends LeadTeamMemberAttributes {
  organization?: SysOrganization;
  team?: LeadTeam;
  user?: SysUser;
}
