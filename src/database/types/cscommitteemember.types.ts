// Auto-generated types for CsCommitteeMember
// Source: src/database/models/customer-service/cs_committee_member.model.ts

import { CommitteeMemberType } from '../models/customer-service/cs_committee.types';
import { CommitteeDesignation } from '../models/customer-service/cs_committee.types';
import { CommitteeMemberStatus } from '../models/customer-service/cs_committee.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CsCommitteeMemberAttributes {
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
  memberType: CommitteeMemberType;
  flatNumber?: string | null;
  name: string;
  designation: CommitteeDesignation;
  responsibility?: string | null;
  phone: string;
  email?: string | null;
  termStart: string;
  termEnd?: string | null;
  status: CommitteeMemberStatus;
  notes?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface CsCommitteeMemberCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  memberType?: CommitteeMemberType; // Has default value
  flatNumber?: string | null;
  name: string;
  designation?: CommitteeDesignation; // Has default value
  responsibility?: string | null;
  phone: string;
  email?: string | null;
  termStart: string;
  termEnd?: string | null;
  status?: CommitteeMemberStatus; // Has default value
  notes?: string | null;
}

export type CsCommitteeMemberUpdateAttributes = Partial<CsCommitteeMemberCreationAttributes>;

// Helper type for including relations
export interface CsCommitteeMemberWithRelations extends CsCommitteeMemberAttributes {
  organization?: SysOrganization;
  project?: Project;
}
