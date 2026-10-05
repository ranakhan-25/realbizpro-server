// Auto-generated types for SupplierAccounts
// Source: src\database\models\contract\pr_supplier_accounts_model.ts

import { SupplierAccountsStatus } from '../models/contract/pr_supplier_accounts_model';

export interface SupplierAccountsAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  supplierCode: string;
  supplierName: string;
  businessName?: string | null;
  email?: string | null;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  dueDate?: Date | null;
  underGroup?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: SupplierAccountsStatus;
}

export interface SupplierAccountsCreationAttributes {
  supplierCode: string;
  supplierName: string;
  businessName?: string | null;
  email?: string | null;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  dueDate?: Date | null;
  underGroup?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: SupplierAccountsStatus; // Has default value
}

export type SupplierAccountsUpdateAttributes = Partial<SupplierAccountsCreationAttributes>;

// Helper type for including relations
export interface SupplierAccountsWithRelations extends SupplierAccountsAttributes {
  // No relations defined
}
