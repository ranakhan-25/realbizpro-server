// Auto-generated types for LeadActivity
// Source: src/database/models/crm/lead/crm-lead-activity.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';
import type { LeadVisitPlace } from '../models/crm/lead/crm-lead-master-data.model';
import type { LeadVisitStatus } from '../models/crm/lead/crm-lead-master-data.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface LeadActivityAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  leadId: number;
  activityType: string;
  activityDate: Date;
  summary: string;
  discussionPoints?: string | null;
  nextFollowupDate?: Date | null;
  visitPlaceId?: number | null;
  visitStatusId?: number | null;
  feedback?: string | null;
  conductedBy?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  lead?: Lead;
  visitPlace?: LeadVisitPlace;
  visitStatus?: LeadVisitStatus;
  conductedByUser?: SysUser;
}

export interface LeadActivityCreationAttributes {
  leadId: number;
  activityType: string;
  activityDate: Date;
  summary: string;
  discussionPoints?: string | null;
  nextFollowupDate?: Date | null;
  visitPlaceId?: number | null;
  visitStatusId?: number | null;
  feedback?: string | null;
  conductedBy?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type LeadActivityUpdateAttributes = Partial<LeadActivityCreationAttributes>;

// Helper type for including relations
export interface LeadActivityWithRelations extends LeadActivityAttributes {
  organization?: SysOrganization;
  lead?: Lead;
  visitPlace?: LeadVisitPlace;
  visitStatus?: LeadVisitStatus;
  conductedByUser?: SysUser;
}
