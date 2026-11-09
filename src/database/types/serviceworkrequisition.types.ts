// Auto-generated types for ServiceWorkRequisition
// Source: src\database\models\projects\service-work-requisition\pr_service_work_requisition.model.ts

import { ServiceWorkRequisitionStatus } from '../models/projects/service-work-requisition/pr_service_work_requisition.model';

import type { Project } from '../models/projects/project/pr_project.model';
import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { BillingSubCategory } from '../models/projects/billing/pr_sub_category.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { ServiceWorkRequisitionItem } from '../models/projects/service-work-requisition-item/pr_service_work_requisition_item.model';
import type { ProcurementWorkOrder } from '../models/procurement/work-order/pr_procurement_work_order.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ServiceWorkRequisitionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  requisitionDate: Date;
  requisitionCode: string;
  projectType?: string | null;
  targetProjectId?: string | null;
  titleOrWorkNameId?: string | null;
  taskSubcategory?: string | null;
  constructionSiteId?: string | null;
  subtotalAmount: number;
  grandTotalPayable: number;
  supportingAttachment?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: ServiceWorkRequisitionStatus;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  project?: Project;
  titleOrWorkName?: BillingCategory;
  taskSubcategoryItem?: BillingSubCategory;
  constructionSite?: Site;
  items?: ServiceWorkRequisitionItem[];
  procurementWorkOrders?: ProcurementWorkOrder[];
  organization?: SysOrganization;
}

export interface ServiceWorkRequisitionCreationAttributes {
  requisitionDate: Date;
  requisitionCode: string;
  projectType?: string | null;
  targetProjectId?: string | null;
  titleOrWorkNameId?: string | null;
  taskSubcategory?: string | null;
  constructionSiteId?: string | null;
  subtotalAmount?: number; // Has default value
  grandTotalPayable?: number; // Has default value
  supportingAttachment?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: ServiceWorkRequisitionStatus; // Has default value
  orgId?: number | null;
  projectId?: string | null;
}

export type ServiceWorkRequisitionUpdateAttributes = Partial<ServiceWorkRequisitionCreationAttributes>;

// Helper type for including relations
export interface ServiceWorkRequisitionWithRelations extends ServiceWorkRequisitionAttributes {
  project?: Project;
  titleOrWorkName?: BillingCategory;
  taskSubcategoryItem?: BillingSubCategory;
  constructionSite?: Site;
  items?: ServiceWorkRequisitionItem[];
  procurementWorkOrders?: ProcurementWorkOrder[];
  organization?: SysOrganization;
}
