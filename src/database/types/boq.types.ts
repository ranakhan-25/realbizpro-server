// Auto-generated types for Boq
// Source: src/database/models/projects/boq/pr_boq.model.ts

export interface BoqAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid?: string | null;
  date: Date;
  titleOfWork: string;
  task: string;
  budget: number;
  percentageOfTotalBudget: number;
  perSftBudget: number;
  cost: number;
  available: number;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface BoqCreationAttributes {
  uid?: string | null;
  date: Date;
  titleOfWork: string;
  task: string;
  budget?: number; // Has default value
  percentageOfTotalBudget?: number; // Has default value
  perSftBudget?: number; // Has default value
  cost?: number; // Has default value
  available?: number; // Has default value
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BoqUpdateAttributes = Partial<BoqCreationAttributes>;

// Helper type for including relations
export interface BoqWithRelations extends BoqAttributes {
  // No relations defined
}
