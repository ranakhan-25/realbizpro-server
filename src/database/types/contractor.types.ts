// Auto-generated types for Contractor
// Source: src\database\models\projects\contract\pr_contractor.model.ts

import { ContractorUnderStatus } from '../models/projects/contract/pr_contractor.model';
import { ContractorStatus } from '../models/projects/contract/pr_contractor.model';

export interface ContractorAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  businessName?: string | null;
  email?: string | null;
  mobileNo: string;
  address?: string | null;
  creditLimit?: number | null;
  dueDate?: Date | null;
  under: ContractorUnderStatus;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: ContractorStatus;
}

export interface ContractorCreationAttributes {
  code: string;
  name: string;
  businessName?: string | null;
  email?: string | null;
  mobileNo: string;
  address?: string | null;
  creditLimit?: number | null;
  dueDate?: Date | null;
  under?: ContractorUnderStatus; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: ContractorStatus; // Has default value
}

export type ContractorUpdateAttributes = Partial<ContractorCreationAttributes>;

// Helper type for including relations
export interface ContractorWithRelations extends ContractorAttributes {
  // No relations defined
}
