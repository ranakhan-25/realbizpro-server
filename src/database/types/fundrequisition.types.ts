// Auto-generated types for FundRequisition
// Source: src\database\models\projects\fund-requisition\pr_fund_requisition.model.ts

import { ApproveStatus } from '../models/projects/fund-requisition/pr_fund_requisition.model';
import { PaymentStatus } from '../models/projects/fund-requisition/pr_fund_requisition.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface FundRequisitionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: Date;
  projectType?: string | null;
  projectId?: string | null;
  taskId?: string | null;
  siteId?: string | null;
  fromUserId?: string | null;
  amount: number;
  approvedAmount?: number | null;
  paidAmount?: number | null;
  purpose: string;
  reference?: string | null;
  approveStatus?: ApproveStatus | null;
  paymentStatus?: PaymentStatus | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface FundRequisitionCreationAttributes {
  date: Date;
  projectType?: string | null;
  projectId?: string | null;
  taskId?: string | null;
  siteId?: string | null;
  fromUserId?: string | null;
  amount: number;
  approvedAmount?: number | null;
  paidAmount?: number | null;
  purpose: string;
  reference?: string | null;
  approveStatus?: ApproveStatus | null;
  paymentStatus?: PaymentStatus | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type FundRequisitionUpdateAttributes = Partial<FundRequisitionCreationAttributes>;

// Helper type for including relations
export interface FundRequisitionWithRelations extends FundRequisitionAttributes {
  organization?: SysOrganization;
  project?: Project;
}
