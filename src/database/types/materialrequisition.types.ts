// Auto-generated types for MaterialRequisition
// Source: src/database/models/projects/material-requisition/pr_material_requisition.model.ts

import { ApprovalLayerStatus } from '../models/projects/material-requisition/pr_material_requisition.model';
import { MaterialRequisitionStatus } from '../models/projects/material-requisition/pr_material_requisition.model';

import type { Project } from '../models/projects/project/pr_project.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { MaterialRequisitionItem } from '../models/projects/material-requisition-item/pr_material_requisition_item.model';
import type { ProcurementRfq } from '../models/procurement/rfq/pr_rfq.model';
import type { ProcurementAssetRfq } from '../models/procurement/rfq/pr_asset_rfq.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface MaterialRequisitionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: string;
  demandDate?: string | null;
  code: string;
  ref?: string | null;
  projectType?: string | null;
  projectId?: string | null;
  titleNameOfWork?: string | null;
  ifTask?: string | null;
  siteId?: string | null;
  categoryId?: string | null;
  note?: string | null;
  total: number | null;
  attachment?: string | null;
  addedById?: string | null;
  approvalLayer: ApprovalLayerStatus | null;
  status: MaterialRequisitionStatus;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  project?: Project;
  site?: Site;
  category?: BillingCategory;
  items?: MaterialRequisitionItem[];
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  organization?: SysOrganization;
}

export interface MaterialRequisitionCreationAttributes {
  date: string;
  demandDate?: string | null;
  code: string;
  ref?: string | null;
  projectType?: string | null;
  projectId?: string | null;
  titleNameOfWork?: string | null;
  ifTask?: string | null;
  siteId?: string | null;
  categoryId?: string | null;
  note?: string | null;
  total?: number | null; // Has default value
  attachment?: string | null;
  addedById?: string | null;
  approvalLayer?: ApprovalLayerStatus | null; // Has default value
  status?: MaterialRequisitionStatus; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type MaterialRequisitionUpdateAttributes = Partial<MaterialRequisitionCreationAttributes>;

// Helper type for including relations
export interface MaterialRequisitionWithRelations extends MaterialRequisitionAttributes {
  project?: Project;
  site?: Site;
  category?: BillingCategory;
  items?: MaterialRequisitionItem[];
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  organization?: SysOrganization;
}
