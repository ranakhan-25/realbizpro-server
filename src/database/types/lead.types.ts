// Auto-generated types for Lead
// Source: src/database/models/crm/lead/crm-lead.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { LeadCategory } from '../models/crm/lead/crm-lead-master-data.model';
import type { LeadStage } from '../models/crm/configuration/crm-lead-stage.model';
import type { LeadSource } from '../models/crm/lead/crm-lead-master-data.model';
import type { LeadCampaign } from '../models/crm/lead/crm-lead-master-data.model';
import type { LeadProfession } from '../models/crm/lead/crm-lead-master-data.model';
import type { CrmOffer } from '../models/crm/configuration/crm-offer.model';
import type { LeadArea } from '../models/crm/lead/crm-lead-master-data.model';
import type { LeadPriceRange } from '../models/crm/lead/crm-lead-master-data.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { LeadActivity } from '../models/crm/lead/crm-lead-activity.model';
import type { LeadAttachment } from '../models/crm/lead/crm-lead-attachment.model';
import type { LeadCallAssignment } from '../models/crm/lead/crm-lead-call-assignment.model';
import type { LeadPropertyInterest } from '../models/crm/lead/crm-lead-property-interest.model';
import type { LeadRequirement } from '../models/crm/lead/crm-lead-requirement.model';
import type { LeadTransferLog } from '../models/crm/lead/crm-lead-transfer-log.model';
import type { CrmLeadNegotiation } from '../models/crm/call-center/crm-lead-negotiation.model';

export interface LeadAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  leadCode: string;
  clientName: string;
  phone: string;
  alternatePhone?: string | null;
  email?: string | null;
  leadCategoryId?: number | null;
  leadStageId?: number | null;
  leadSourceId?: number | null;
  campaignId?: number | null;
  professionId?: number | null;
  offerId?: number | null;
  designation?: string | null;
  organization?: string | null;
  presentAddress?: string | null;
  permanentAddress?: string | null;
  assignedTo?: string | null;
  priority?: string | null;
  leadScore?: number | null;
  status?: string | null;
  notes?: string | null;
  leadDate: string;
  creditOfficerId?: string | null;
  birthDate?: string | null;
  anniversaryDate?: string | null;
  areaId?: number | null;
  priceRangeId?: number | null;
  leadType?: string | null;
  initialRemark?: string | null;
  query?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  tenantOrganization?: SysOrganization;
  category?: LeadCategory;
  stage?: LeadStage;
  source?: LeadSource;
  campaign?: LeadCampaign;
  profession?: LeadProfession;
  offer?: CrmOffer;
  area?: LeadArea;
  priceRange?: LeadPriceRange;
  project?: Project;
  assignedUser?: SysUser;
  creditOfficer?: SysUser;
  activities?: LeadActivity[];
  attachments?: LeadAttachment[];
  callAssignments?: LeadCallAssignment[];
  propertyInterests?: LeadPropertyInterest[];
  requirements?: LeadRequirement[];
  transferLogs?: LeadTransferLog[];
  negotiations?: CrmLeadNegotiation[];
}

export interface LeadCreationAttributes {
  leadCode: string;
  clientName: string;
  phone: string;
  alternatePhone?: string | null;
  email?: string | null;
  leadCategoryId?: number | null;
  leadStageId?: number | null;
  leadSourceId?: number | null;
  campaignId?: number | null;
  professionId?: number | null;
  offerId?: number | null;
  designation?: string | null;
  organization?: string | null;
  presentAddress?: string | null;
  permanentAddress?: string | null;
  assignedTo?: string | null;
  priority?: string | null;
  leadScore?: number | null;
  status?: string | null;
  notes?: string | null;
  leadDate: string;
  creditOfficerId?: string | null;
  birthDate?: string | null;
  anniversaryDate?: string | null;
  areaId?: number | null;
  priceRangeId?: number | null;
  leadType?: string | null;
  initialRemark?: string | null;
  query?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type LeadUpdateAttributes = Partial<LeadCreationAttributes>;

// Helper type for including relations
export interface LeadWithRelations extends LeadAttributes {
  tenantOrganization?: SysOrganization;
  category?: LeadCategory;
  stage?: LeadStage;
  source?: LeadSource;
  campaign?: LeadCampaign;
  profession?: LeadProfession;
  offer?: CrmOffer;
  area?: LeadArea;
  priceRange?: LeadPriceRange;
  project?: Project;
  assignedUser?: SysUser;
  creditOfficer?: SysUser;
  activities?: LeadActivity[];
  attachments?: LeadAttachment[];
  callAssignments?: LeadCallAssignment[];
  propertyInterests?: LeadPropertyInterest[];
  requirements?: LeadRequirement[];
  transferLogs?: LeadTransferLog[];
  negotiations?: CrmLeadNegotiation[];
}
