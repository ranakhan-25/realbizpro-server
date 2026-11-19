// Auto-generated types for CsSecurityVisitorLog
// Source: src/database/models/customer-service/cs_security_visitor_log.model.ts

import { VisitorPurpose } from '../models/customer-service/cs_security.types';
import { VisitorStatus } from '../models/customer-service/cs_security.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsSecurityGuard } from '../models/customer-service/cs_security_guard.model';

export interface CsSecurityVisitorLogAttributes {
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
  visitorName: string;
  phone: string;
  flatVisited: string;
  purpose: VisitorPurpose;
  inTime: Date;
  outTime?: Date | null;
  guardOnDutyId?: number | null;
  vehicleNumber?: string | null;
  nationalIdOrBadge?: string | null;
  status: VisitorStatus;
  remarks?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  guardOnDuty?: CsSecurityGuard;
}

export interface CsSecurityVisitorLogCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  visitorName: string;
  phone: string;
  flatVisited: string;
  purpose: VisitorPurpose;
  inTime?: Date; // Has default value
  outTime?: Date | null;
  guardOnDutyId?: number | null;
  vehicleNumber?: string | null;
  nationalIdOrBadge?: string | null;
  status?: VisitorStatus; // Has default value
  remarks?: string | null;
}

export type CsSecurityVisitorLogUpdateAttributes = Partial<CsSecurityVisitorLogCreationAttributes>;

// Helper type for including relations
export interface CsSecurityVisitorLogWithRelations extends CsSecurityVisitorLogAttributes {
  organization?: SysOrganization;
  project?: Project;
  guardOnDuty?: CsSecurityGuard;
}
