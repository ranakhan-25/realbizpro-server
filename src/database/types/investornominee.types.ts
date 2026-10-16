// Auto-generated types for InvestorNominee
// Source: src/database/models/projects/investor/investor_nominee.model.ts

import type { Investor } from '../models/projects/investor/investor.model';

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

  // Relations
  investor?: Investor;
}

export interface InvestorNomineeCreationAttributes {
  investorId: string;
  nomineeName: string;
  nomineeNid: string;
  relation: string;
  percentage: number;
}

export type InvestorNomineeUpdateAttributes = Partial<InvestorNomineeCreationAttributes>;

// Helper type for including relations
export interface InvestorNomineeWithRelations extends InvestorNomineeAttributes {
  investor?: Investor;
}
