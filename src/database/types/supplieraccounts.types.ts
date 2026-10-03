// Auto-generated types for SupplierAccounts
// Source: src\database\models\supplier accounts\sa_supplier_accounts_model.ts

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
}

export type SupplierAccountsUpdateAttributes = Partial<SupplierAccountsCreationAttributes>;

// Helper type for including relations
export interface SupplierAccountsWithRelations extends SupplierAccountsAttributes {
  // No relations defined
}
