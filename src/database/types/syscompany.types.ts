// Auto-generated types for SysCompany
// Source: src/database/models/system/sys_company.model.ts

export interface SysCompanyAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  address: string | null;
  bnName?: string | null;
  bnAddress: string | null;
  mobile: string | null;
  telephone?: string | null;
  ipPhone?: string | null;
  vatRegNum: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  status: 'Active' | 'Inactive';
  createdBy: number | null;
  deletedBy: number | null;
  updatedBy?: number | null;
}

export interface SysCompanyCreationAttributes {
  name: string;
  address?: string | null; // Nullable
  bnName?: string | null;
  bnAddress?: string | null; // Nullable
  mobile?: string | null; // Nullable
  telephone?: string | null;
  ipPhone?: string | null;
  vatRegNum?: string | null; // Nullable
  email?: string | null; // Nullable
  website?: string | null; // Nullable
  logo?: string | null; // Nullable
  status?: 'Active' | 'Inactive'; // Has default value
  createdBy?: number | null; // Nullable
  deletedBy?: number | null; // Nullable
  updatedBy?: number | null;
}

export type SysCompanyUpdateAttributes = Partial<SysCompanyCreationAttributes>;

// Helper type for including relations
export interface SysCompanyWithRelations extends SysCompanyAttributes {
  // No relations defined
}
