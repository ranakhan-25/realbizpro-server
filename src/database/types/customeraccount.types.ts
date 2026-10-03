// Auto-generated types for CustomerAccount
// Source: src\database\models\customer account\ca_customer_accounts_model.ts

export interface CustomerAccountAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  customerCode: string;
  customerName: string;
  mobileNo: string;
  email?: string | null;
  businessName?: string | null;
  nidOrPassport?: string | null;
  underGroup?: string | null;
  address?: string | null;
  addedById?: string | null;
}

export interface CustomerAccountCreationAttributes {
  customerCode: string;
  customerName: string;
  mobileNo: string;
  email?: string | null;
  businessName?: string | null;
  nidOrPassport?: string | null;
  underGroup?: string | null;
  address?: string | null;
  addedById?: string | null;
}

export type CustomerAccountUpdateAttributes = Partial<CustomerAccountCreationAttributes>;

// Helper type for including relations
export interface CustomerAccountWithRelations extends CustomerAccountAttributes {
  // No relations defined
}
