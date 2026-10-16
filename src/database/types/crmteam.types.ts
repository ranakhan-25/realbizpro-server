// Auto-generated types for CrmTeam
// Source: src/database/models/crm/crm_team.model.ts

import type { CrmTeamMember } from '../models/crm/crm_team_member.model';

export interface CrmTeamAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  leader_id?: string | null;
  department?: string | null;
  is_active: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  members: CrmTeamMember[];
}

export interface CrmTeamCreationAttributes {
  name: string;
  leader_id?: string | null;
  department?: string | null;
  is_active?: boolean; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmTeamUpdateAttributes = Partial<CrmTeamCreationAttributes>;

// Helper type for including relations
export interface CrmTeamWithRelations extends CrmTeamAttributes {
  members: CrmTeamMember[];
}
