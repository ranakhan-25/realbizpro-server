// Auto-generated types for InvMaterialUsage
// Source: src/database/models/inventory/inv_material_usage.model.ts

import type { InvMaterialUsageItem } from '../models/inventory/inv_material_usage_item.model';

export interface InvMaterialUsageAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: Date;
  note?: string | null;
  company_id?: number | null;
  project_id?: number | null;
  projectId?: string | null;
  site_id?: number | null;
  task_id?: number | null;
  worker_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  items: InvMaterialUsageItem[];
}

export interface InvMaterialUsageCreationAttributes {
  date: Date;
  note?: string | null;
  company_id?: number | null;
  project_id?: number | null;
  projectId?: string | null;
  site_id?: number | null;
  task_id?: number | null;
  worker_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type InvMaterialUsageUpdateAttributes = Partial<InvMaterialUsageCreationAttributes>;

// Helper type for including relations
export interface InvMaterialUsageWithRelations extends InvMaterialUsageAttributes {
  items: InvMaterialUsageItem[];
}
