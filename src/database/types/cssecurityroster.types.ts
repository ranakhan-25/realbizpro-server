// Auto-generated types for CsSecurityRoster
// Source: src/database/models/customer-service/cs_security_roster.model.ts

import { ShiftName } from '../models/customer-service/cs_security.types';
import { RosterStatus } from '../models/customer-service/cs_security.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsSecurityGuard } from '../models/customer-service/cs_security_guard.model';

export interface CsSecurityRosterAttributes {
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
  guardId: number;
  dutyDate: string;
  shiftName: ShiftName;
  shiftStart: string;
  shiftEnd: string;
  postLocation: string;
  status: RosterStatus;
  notes?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  guard?: CsSecurityGuard;
}

export interface CsSecurityRosterCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  guardId: number;
  dutyDate: string;
  shiftName: ShiftName;
  shiftStart: string;
  shiftEnd: string;
  postLocation: string;
  status?: RosterStatus; // Has default value
  notes?: string | null;
}

export type CsSecurityRosterUpdateAttributes = Partial<CsSecurityRosterCreationAttributes>;

// Helper type for including relations
export interface CsSecurityRosterWithRelations extends CsSecurityRosterAttributes {
  organization?: SysOrganization;
  project?: Project;
  guard?: CsSecurityGuard;
}
