// Auto-generated types for SysCountries
// Source: src/database/models/system/sys_countries.model.ts

import type { SysUser } from '../models/system/sys_user.model';

export interface SysCountriesAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  slug?: string | null;
  shortName: string;
  countryCode?: string | null;
  phoneCode?: string | null;
  capital?: string | null;
  currency: string;
  currencySymbol?: string | null;
  emoji?: string | null;
  emojiU?: string | null;
  status: 'Active' | 'Inactive';
  createdBy?: number | null;
  deletedBy?: number | null;
  updatedBy?: number | null;

  // Relations
  creator?: SysUser;
}

export interface SysCountriesCreationAttributes {
  name: string;
  slug?: string | null;
  shortName: string;
  countryCode?: string | null;
  phoneCode?: string | null;
  capital?: string | null;
  currency: string;
  currencySymbol?: string | null;
  emoji?: string | null;
  emojiU?: string | null;
  status?: 'Active' | 'Inactive'; // Has default value
  createdBy?: number | null;
  deletedBy?: number | null;
  updatedBy?: number | null;
}

export type SysCountriesUpdateAttributes = Partial<SysCountriesCreationAttributes>;

// Helper type for including relations
export interface SysCountriesWithRelations extends SysCountriesAttributes {
  creator?: SysUser;
}
