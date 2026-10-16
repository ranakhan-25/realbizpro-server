// Auto-generated types for CrmLeadCallAssign
// Source: src/database/models/crm/crm_lead_call_assign.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmLeadCallAssignAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: number;
  assigned_from: string;
  assigned_to: string;
  assignment_date: Date;
  due_date?: Date | null;
  priority: string;
  instruction?: string | null;
  status: string;
  completed_at?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  lead: CrmLead;
}

export interface CrmLeadCallAssignCreationAttributes {
  lead_id: number;
  assigned_from: string;
  assigned_to: string;
  assignment_date: Date;
  due_date?: Date | null;
  priority?: string; // Has default value
  instruction?: string | null;
  status?: string; // Has default value
  completed_at?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmLeadCallAssignUpdateAttributes = Partial<CrmLeadCallAssignCreationAttributes>;

// Helper type for including relations
export interface CrmLeadCallAssignWithRelations extends CrmLeadCallAssignAttributes {
  lead: CrmLead;
}
