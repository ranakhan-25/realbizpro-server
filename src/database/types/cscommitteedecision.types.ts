// Auto-generated types for CsCommitteeDecision
// Source: src/database/models/customer-service/cs_committee_decision.model.ts

import { DecisionStatus } from '../models/customer-service/cs_committee.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CsCommitteeDecisionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  title: string;
  meetingDate: string;
  agendaCategory: string;
  resolutionNotes: string;
  status: DecisionStatus;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface CsCommitteeDecisionCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  title: string;
  meetingDate: string;
  agendaCategory?: string; // Has default value
  resolutionNotes: string;
  status?: DecisionStatus; // Has default value
}

export type CsCommitteeDecisionUpdateAttributes = Partial<CsCommitteeDecisionCreationAttributes>;

// Helper type for including relations
export interface CsCommitteeDecisionWithRelations extends CsCommitteeDecisionAttributes {
  organization?: SysOrganization;
  project?: Project;
}
