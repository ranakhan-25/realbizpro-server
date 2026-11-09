// Auto-generated types for InvestorNominee
// Source: src/database/models/projects/investor/investor_nominee.model.ts

import type { Investor } from '../models/projects/investor/investor.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface InvestorNomineeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  investorId: string;
  nomineeName: string;
  nomineeNid: string;
  relation: string;
  percentage: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  investor?: Investor;
  organization?: SysOrganization;
}

export interface InvestorNomineeCreationAttributes {
  investorId: string;
  nomineeName: string;
  nomineeNid: string;
  relation: string;
  percentage: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type InvestorNomineeUpdateAttributes = Partial<InvestorNomineeCreationAttributes>;

// Helper type for including relations
export interface InvestorNomineeWithRelations extends InvestorNomineeAttributes {
  investor?: Investor;
  organization?: SysOrganization;
}
