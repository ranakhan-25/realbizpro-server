// Auto-generated types for CustomerAccount
// Source: src/database/models/projects/contract/pr_customer_accounts.model.ts

import { CustomerAccountStatus } from '../models/projects/contract/pr_customer_accounts.model';

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
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: CustomerAccountStatus;
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
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: CustomerAccountStatus; // Has default value
}

export type CustomerAccountUpdateAttributes = Partial<CustomerAccountCreationAttributes>;

// Helper type for including relations
export interface CustomerAccountWithRelations extends CustomerAccountAttributes {
  // No relations defined
}
