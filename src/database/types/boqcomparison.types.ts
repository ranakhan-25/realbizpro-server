// Auto-generated types for BoqComparison
// Source: src/database/models/projects/boqcomparison/boq-comparison.model.ts

import { BoqComparisonStatus } from '../models/projects/boqcomparison/boq-comparison.model';

export interface BoqComparisonAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid?: string | null;
  titleOfWork: string;
  task: string;
  type: string;
  description: string;
  boqQty: number;
  boqAmount: number;
  issueQty: number;
  issueAmount: number;
  qtyDiff: number;
  amountDiff: number;
  status: BoqComparisonStatus;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface BoqComparisonCreationAttributes {
  uid?: string | null;
  titleOfWork: string;
  task: string;
  type: string;
  description: string;
  boqQty?: number; // Has default value
  boqAmount?: number; // Has default value
  issueQty?: number; // Has default value
  issueAmount?: number; // Has default value
  qtyDiff?: number; // Has default value
  amountDiff?: number; // Has default value
  status?: BoqComparisonStatus; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BoqComparisonUpdateAttributes = Partial<BoqComparisonCreationAttributes>;

// Helper type for including relations
export interface BoqComparisonWithRelations extends BoqComparisonAttributes {
  // No relations defined
}
