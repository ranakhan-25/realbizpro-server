// Auto-generated types for ProjectShareAssignment
// Source: src\database\models\projects\project-share-assignment\pr_project_share_assignment.model.ts

import type { Project } from '../models/projects/project/pr_project.model';
import type { ProjectType } from '../models/projects/project-type/pr_project_type.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProjectShareAssignmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  projectTypeId?: string | null;
  siteId?: string | null;
  shareCode: string;
  customerName: string;
  noOfShares: number;
  flatLand?: string | null;
  note?: string | null;
  email?: string | null;
  mobile?: string | null;
  nid?: string | null;
  address?: string | null;
  image?: string | null;
  shareAmount: number;
  paidAmount: number;
  totalCost: number;
  balance: number;
  due: number;
  penaltyAmount: number;
  points: number;
  assignedAt?: Date | null;
  status: 'active' | 'inactive' | 'pending';
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  project?: Project;
  projectType?: ProjectType;
  site?: Site;
  organization?: SysOrganization;
}

export interface ProjectShareAssignmentCreationAttributes {
  projectId: string;
  projectTypeId?: string | null;
  siteId?: string | null;
  shareCode: string;
  customerName: string;
  noOfShares?: number; // Has default value
  flatLand?: string | null;
  note?: string | null;
  email?: string | null;
  mobile?: string | null;
  nid?: string | null;
  address?: string | null;
  image?: string | null;
  shareAmount?: number; // Has default value
  paidAmount?: number; // Has default value
  totalCost?: number; // Has default value
  balance?: number; // Has default value
  due?: number; // Has default value
  penaltyAmount?: number; // Has default value
  points?: number; // Has default value
  assignedAt?: Date | null;
  status?: 'active' | 'inactive' | 'pending'; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProjectShareAssignmentUpdateAttributes = Partial<ProjectShareAssignmentCreationAttributes>;

// Helper type for including relations
export interface ProjectShareAssignmentWithRelations extends ProjectShareAssignmentAttributes {
  project?: Project;
  projectType?: ProjectType;
  site?: Site;
  organization?: SysOrganization;
}
