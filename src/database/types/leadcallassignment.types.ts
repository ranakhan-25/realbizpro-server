// Auto-generated types for LeadCallAssignment
// Source: src/database/models/crm/lead/crm-lead-call-assignment.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface LeadCallAssignmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  leadId: number;
  assignedFrom: string;
  assignedTo: string;
  assignmentDate: Date;
  dueDate?: Date | null;
  priority?: string | null;
  instruction?: string | null;
  status?: string | null;
  completedAt?: Date | null;
  assignedUserType?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  lead?: Lead;
  assigner?: SysUser;
  assignee?: SysUser;
}

export interface LeadCallAssignmentCreationAttributes {
  leadId: number;
  assignedFrom: string;
  assignedTo: string;
  assignmentDate: Date;
  dueDate?: Date | null;
  priority?: string | null;
  instruction?: string | null;
  status?: string | null;
  completedAt?: Date | null;
  assignedUserType?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type LeadCallAssignmentUpdateAttributes = Partial<LeadCallAssignmentCreationAttributes>;

// Helper type for including relations
export interface LeadCallAssignmentWithRelations extends LeadCallAssignmentAttributes {
  organization?: SysOrganization;
  lead?: Lead;
  assigner?: SysUser;
  assignee?: SysUser;
}
