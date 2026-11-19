// Auto-generated types for LeadStageLog
// Source: src/database/models/lams/lead-stage-log.model.ts

import type { AcquisitionLead } from '../models/lams/acquisition-lead.model';

export interface LeadStageLogAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  org_id: string;
  lead_id: any;
  from_stage: string;
  to_stage: string;
  remarks: string;
  transitioned_by?: string | null;
  created_by?: number | null;

  // Relations
  acquisition_lead?: AcquisitionLead;
}

export interface LeadStageLogCreationAttributes {
  org_id: string;
  lead_id: any;
  from_stage: string;
  to_stage: string;
  remarks: string;
  transitioned_by?: string | null;
  created_by?: number | null;
}

export type LeadStageLogUpdateAttributes = Partial<LeadStageLogCreationAttributes>;

// Helper type for including relations
export interface LeadStageLogWithRelations extends LeadStageLogAttributes {
  acquisition_lead?: AcquisitionLead;
}
