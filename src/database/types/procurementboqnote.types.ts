// Auto-generated types for ProcurementBoqNote
// Source: src/database/models/procurement/boq/pr_procurement_boq_note.model.ts

import type { ProcurementBoq } from '../models/procurement/boq/pr_procurement_boq.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementBoqNoteAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  boq_id: string;
  note: string;
  sort_order: number;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  boq?: ProcurementBoq;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementBoqNoteCreationAttributes {
  boq_id: string;
  note: string;
  sort_order?: number; // Has default value
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementBoqNoteUpdateAttributes = Partial<ProcurementBoqNoteCreationAttributes>;

// Helper type for including relations
export interface ProcurementBoqNoteWithRelations extends ProcurementBoqNoteAttributes {
  boq?: ProcurementBoq;
  organization?: SysOrganization;
  project?: Project;
}
