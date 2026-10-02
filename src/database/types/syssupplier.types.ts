// Auto-generated types for SysSupplier
// Source: src\database\models\system\supplier\sys_suplier.model.ts

import { StatusEnum } from '@/database/enum/status.enum';

export interface SysSupplierAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  supplierName: string;
  code: string;
  type: | 'Local'
    | 'Import'
    | 'Exempted'
    | 'Service';
  contactName: string | null;
  phone: string | null;
  email: string | null;
  mobile: string | null;
  bin: string | null;
  nidNo: string | null;
  vatStatus: | 'Vat Applicable'
    | 'Zero Vat'
    | 'Vat Exempted'
    | null;
  countryId: number | null;
  status: StatusEnum;
  address: string | null;
  note: string | null;
}

export interface SysSupplierCreationAttributes {
  supplierName: string;
  code: string;
  type: | 'Local'
    | 'Import'
    | 'Exempted'
    | 'Service';
  contactName?: string | null; // Nullable
  phone?: string | null; // Nullable
  email?: string | null; // Nullable
  mobile?: string | null; // Nullable
  bin?: string | null; // Nullable
  nidNo?: string | null; // Nullable
  vatStatus?: | 'Vat Applicable'
    | 'Zero Vat'
    | 'Vat Exempted'
    | null; // Nullable
  countryId?: number | null; // Nullable
  status?: StatusEnum; // Has default value
  address?: string | null; // Nullable
  note?: string | null; // Nullable
}

export type SysSupplierUpdateAttributes = Partial<SysSupplierCreationAttributes>;

// Helper type for including relations
export interface SysSupplierWithRelations extends SysSupplierAttributes {
  // No relations defined
}
