// Auto-generated types for PartyDocument
// Source: src/database/models/procurement/parties/party-document.model.ts

import type { Party } from '../models/procurement/parties/party.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface PartyDocumentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  partyId: string;
  title: string;
  file: string;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  party?: Party;
  organization?: SysOrganization;
  project?: Project;
}

export interface PartyDocumentCreationAttributes {
  partyId: string;
  title: string;
  file: string;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type PartyDocumentUpdateAttributes = Partial<PartyDocumentCreationAttributes>;

// Helper type for including relations
export interface PartyDocumentWithRelations extends PartyDocumentAttributes {
  party?: Party;
  organization?: SysOrganization;
  project?: Project;
}
