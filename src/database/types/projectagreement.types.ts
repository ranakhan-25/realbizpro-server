// Auto-generated types for ProjectAgreement
// Source: src/database/models/projects/project_aggrement/pr_project_aggrement_model.ts

import { AgreementType } from '../models/projects/project_aggrement/pr_project_aggrement_model';
import { AgreementStatus } from '../models/projects/project_aggrement/pr_project_aggrement_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProjectAgreementAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectUuid: string;
  partyUuid: string;
  agreementCode: string;
  agreementType: AgreementType;
  signedDate: Date;
  startDate: Date;
  endDate?: Date | null;
  contractValue: number;
  agreementFile?: string | null;
  notes?: string | null;
  status: AgreementStatus;
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

export interface ProjectAgreementCreationAttributes {
  projectUuid: string;
  partyUuid: string;
  agreementCode: string;
  agreementType?: AgreementType; // Has default value
  signedDate: Date;
  startDate: Date;
  endDate?: Date | null;
  contractValue?: number; // Has default value
  agreementFile?: string | null;
  notes?: string | null;
  status?: AgreementStatus; // Has default value
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProjectAgreementUpdateAttributes = Partial<ProjectAgreementCreationAttributes>;

// Helper type for including relations
export interface ProjectAgreementWithRelations extends ProjectAgreementAttributes {
  organization?: SysOrganization;
  project?: Project;
}
