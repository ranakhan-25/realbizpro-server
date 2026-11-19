// Auto-generated types for ProjectParty
// Source: src/database/models/projects/project_party/pr_project_party_model.ts

import { PartyType } from '../models/projects/project_party/pr_project_party_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProjectPartyAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectUuid: string;
  partyCode: string;
  partyType: PartyType;
  partyBusinessName: string;
  phoneNumber: string;
  email?: string | null;
  equityShare: number;
  agreementRef?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface ProjectPartyCreationAttributes {
  projectUuid: string;
  partyCode: string;
  partyType?: PartyType; // Has default value
  partyBusinessName: string;
  phoneNumber: string;
  email?: string | null;
  equityShare?: number; // Has default value
  agreementRef?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProjectPartyUpdateAttributes = Partial<ProjectPartyCreationAttributes>;

// Helper type for including relations
export interface ProjectPartyWithRelations extends ProjectPartyAttributes {
  organization?: SysOrganization;
  project?: Project;
}
