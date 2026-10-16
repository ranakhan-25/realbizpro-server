// Auto-generated types for FundRequisition
// Source: src\database\models\projects\fund-requisition\pr_fund_requisition.model.ts

import { ApproveStatus } from '../models/projects/fund-requisition/pr_fund_requisition.model';
import { PaymentStatus } from '../models/projects/fund-requisition/pr_fund_requisition.model';

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
}

export type FundRequisitionUpdateAttributes = Partial<FundRequisitionCreationAttributes>;

// Helper type for including relations
export interface FundRequisitionWithRelations extends FundRequisitionAttributes {
  // No relations defined
}
