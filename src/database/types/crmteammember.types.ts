// Auto-generated types for CrmTeamMember
// Source: src\database\models\crm\crm_team_member.model.ts

import type { CrmTeam } from '../models/crm/crm_team.model';

export interface CrmTeamMemberAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  team_id: number;
  user_id: string;
  role_in_team?: string | null;
  is_active: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  team: CrmTeam;
}

export interface CrmTeamMemberCreationAttributes {
  team_id: number;
  user_id: string;
  role_in_team?: string | null;
  is_active?: boolean; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmTeamMemberUpdateAttributes = Partial<CrmTeamMemberCreationAttributes>;

// Helper type for including relations
export interface CrmTeamMemberWithRelations extends CrmTeamMemberAttributes {
  team: CrmTeam;
}
