// Auto-generated types for ProjectType
// Source: src\database\models\projects\project-type\pr_project_type.model.ts

import type { ProjectShareAssignment } from '../models/projects/project-share-assignment/pr_project_share_assignment.model';
import type { Invoice } from '../models/projects/billing/pr_invoice.model';
import type { WorkOrder } from '../models/projects/billing/work-order/pr_work_order.model';

export interface ProjectTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;

  // Relations
  shareAssignments?: ProjectShareAssignment[];
  invoices?: Invoice[];
  workOrders?: WorkOrder[];
}

export interface ProjectTypeCreationAttributes {
  code: string;
  name: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export type ProjectTypeUpdateAttributes = Partial<ProjectTypeCreationAttributes>;

// Helper type for including relations
export interface ProjectTypeWithRelations extends ProjectTypeAttributes {
  shareAssignments?: ProjectShareAssignment[];
  invoices?: Invoice[];
  workOrders?: WorkOrder[];
}
