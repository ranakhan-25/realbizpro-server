// Auto-generated types for ProcurementBoq
// Source: src/database/models/procurement/boq/pr_procurement_boq.model.ts

import { ProcurementBoqStatus } from '../models/procurement/boq/pr_procurement_boq.model';

import type { Project } from '../models/projects/project/pr_project.model';
import type { SysCompany } from '../models/system/sys_company.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementBoqItem } from '../models/procurement/boq/pr_procurement_boq_item.model';
import type { ProcurementBoqNote } from '../models/procurement/boq/pr_procurement_boq_note.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementBoqAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  project_id: string;
  company_id?: string | null;
  responsible_user_id?: number | null;
  added_by_id?: number | null;
  title: string;
  responsible_person?: string | null;
  date: string;
  due_date: string;
  boq_type: string;
  status: ProcurementBoqStatus;
  material_cost: number;
  equipment_misc_cost: number;
  labour_cost: number;
  subcontract_cost: number;
  subtotal: number;
  margin_overhead: number;
  grand_total: number;
  remarks?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  project?: Project;
  company?: SysCompany;
  responsibleUser?: SysUser;
  addedBy?: SysUser;
  items?: ProcurementBoqItem[];
  importantNotes?: ProcurementBoqNote[];
  organization?: SysOrganization;
}

export interface ProcurementBoqCreationAttributes {
  project_id: string;
  company_id?: string | null;
  responsible_user_id?: number | null;
  added_by_id?: number | null;
  title: string;
  responsible_person?: string | null;
  date: string;
  due_date: string;
  boq_type: string;
  status?: ProcurementBoqStatus; // Has default value
  material_cost?: number; // Has default value
  equipment_misc_cost?: number; // Has default value
  labour_cost?: number; // Has default value
  subcontract_cost?: number; // Has default value
  subtotal?: number; // Has default value
  margin_overhead?: number; // Has default value
  grand_total?: number; // Has default value
  remarks?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProcurementBoqUpdateAttributes = Partial<ProcurementBoqCreationAttributes>;

// Helper type for including relations
export interface ProcurementBoqWithRelations extends ProcurementBoqAttributes {
  project?: Project;
  company?: SysCompany;
  responsibleUser?: SysUser;
  addedBy?: SysUser;
  items?: ProcurementBoqItem[];
  importantNotes?: ProcurementBoqNote[];
  organization?: SysOrganization;
}
