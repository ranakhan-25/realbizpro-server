// Auto-generated types for LabourWorkBank
// Source: src\database\models\labour work bank\lb_labour_work_bank_model.ts

export interface LabourWorkBankAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  businessName?: string | null;
  email?: string | null;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  dueDate?: Date | null;
  underGroup?: string | null;
  addedById?: string | null;
}

export interface LabourWorkBankCreationAttributes {
  code: string;
  name: string;
  businessName?: string | null;
  email?: string | null;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  dueDate?: Date | null;
  underGroup?: string | null;
  addedById?: string | null;
}

export type LabourWorkBankUpdateAttributes = Partial<LabourWorkBankCreationAttributes>;

// Helper type for including relations
export interface LabourWorkBankWithRelations extends LabourWorkBankAttributes {
  // No relations defined
}
