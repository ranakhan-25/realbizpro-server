// Auto-generated types for Investor
// Source: src/database/models/projects/investor/investor.model.ts

import { InvestorGroupTier } from '../models/projects/investor/investor.model';
import { InvestorStatus } from '../models/projects/investor/investor.model';

import type { InvestorNominee } from '../models/projects/investor/investor_nominee.model';

export interface InvestorAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  mobileNo: string;
  email?: string | null;
  nid: string;
  address?: string | null;
  image?: string | null;
  groupTier: InvestorGroupTier;
  underGroup?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: InvestorStatus;

  // Relations
  nominees?: InvestorNominee[];
}

export interface InvestorCreationAttributes {
  code: string;
  name: string;
  mobileNo: string;
  email?: string | null;
  nid: string;
  address?: string | null;
  image?: string | null;
  groupTier: InvestorGroupTier;
  underGroup?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: InvestorStatus; // Has default value
}

export type InvestorUpdateAttributes = Partial<InvestorCreationAttributes>;

// Helper type for including relations
export interface InvestorWithRelations extends InvestorAttributes {
  nominees?: InvestorNominee[];
}
