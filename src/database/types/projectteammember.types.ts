// Auto-generated types for ProjectTeamMember
// Source: src\database\models\projects\project-team-member\pr_project_team_member.model.ts

import type { Project } from '../models/projects/project/pr_project.model';

export interface ProjectTeamMemberAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  name: string;
  email: string;
  phone?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  project?: Project;
}

export interface ProjectTeamMemberCreationAttributes {
  projectId: string;
  name: string;
  email: string;
  phone?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProjectTeamMemberUpdateAttributes = Partial<ProjectTeamMemberCreationAttributes>;

// Helper type for including relations
export interface ProjectTeamMemberWithRelations extends ProjectTeamMemberAttributes {
  project?: Project;
}
