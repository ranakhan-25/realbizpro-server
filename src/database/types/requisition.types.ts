// Auto-generated types for Requisition
// Source: src\database\models\Requisition\re_material_requisition_model.ts

import { ApprovalStatusEnum } from '../models/Requisition/re_material_requisition_model';
import { RequisitionStatusEnum } from '../models/Requisition/re_material_requisition_model';

export interface RequisitionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  requisitionNo: string;
  referenceNo?: string | null;
  requisitionDate: Date;
  demandDate?: Date | null;
  companyId?: string | null;
  projectId: string;
  titleOfWork: string;
  department?: string | null;
  addedById?: string | null;
  approvalStatus: ApprovalStatusEnum | string;
  attachmentUrl?: string | null;
  status: RequisitionStatusEnum | string;
  remarks?: string | null;
}

export interface RequisitionCreationAttributes {
  requisitionNo: string;
  referenceNo?: string | null;
  requisitionDate?: Date; // Has default value
  demandDate?: Date | null;
  companyId?: string | null;
  projectId: string;
  titleOfWork: string;
  department?: string | null;
  addedById?: string | null;
  approvalStatus?: ApprovalStatusEnum | string; // Has default value
  attachmentUrl?: string | null;
  status?: RequisitionStatusEnum | string; // Has default value
  remarks?: string | null;
}

export type RequisitionUpdateAttributes = Partial<RequisitionCreationAttributes>;

// Helper type for including relations
export interface RequisitionWithRelations extends RequisitionAttributes {
  // No relations defined
}
