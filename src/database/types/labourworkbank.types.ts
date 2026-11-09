// Auto-generated types for LabourWorkBank
// Source: src/database/models/projects/contract/pr_labour_work_bank.model.ts

import { LabourWorkBankStatus } from '../models/projects/contract/pr_labour_work_bank.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface LabourWorkBankAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  businessName?: string | null;
  email?: string | null;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  dueDate?: Date | null;
  underGroup?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: LabourWorkBankStatus;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface LabourWorkBankCreationAttributes {
  code: string;
  name: string;
  businessName?: string | null;
  email?: string | null;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  dueDate?: Date | null;
  underGroup?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: LabourWorkBankStatus; // Has default value
  orgId?: number | null;
  projectId?: string | null;
}

export type LabourWorkBankUpdateAttributes = Partial<LabourWorkBankCreationAttributes>;

// Helper type for including relations
export interface LabourWorkBankWithRelations extends LabourWorkBankAttributes {
  organization?: SysOrganization;
  project?: Project;
}
