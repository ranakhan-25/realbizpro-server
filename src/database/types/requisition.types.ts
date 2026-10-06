// Auto-generated types for Requisition
// Source: src\database\models\projects\Requisition\re_material_requisition_model.ts

import { ApprovalStatusEnum } from '../models/projects/Requisition/re_material_requisition_model';
import { RequisitionStatusEnum } from '../models/projects/Requisition/re_material_requisition_model';

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
  approvalStatus: ApprovalStatusEnum;
  attachmentUrl?: string | null;
  status: RequisitionStatusEnum;
  remarks?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
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
  approvalStatus?: ApprovalStatusEnum; // Has default value
  attachmentUrl?: string | null;
  status?: RequisitionStatusEnum; // Has default value
  remarks?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type RequisitionUpdateAttributes = Partial<RequisitionCreationAttributes>;

// Helper type for including relations
export interface RequisitionWithRelations extends RequisitionAttributes {
  // No relations defined
}
