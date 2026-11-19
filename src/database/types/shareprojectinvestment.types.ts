// Auto-generated types for ShareProjectInvestment
// Source: src/database/models/share-project/share-project-investment.model.ts

import { ShareProjectInvestmentStatus } from '../models/share-project/share-project-investment.model';

import type { ShareProject } from '../models/share-project/share-project.model';
import type { ShareUser } from '../models/share-user/share-user.model';

export interface ShareProjectInvestmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code?: string | null;
  investorName?: string | null;
  investorEmail?: string | null;
  investorPhone?: string | null;
  projectId: string;
  investorId: number;
  quantity: number;
  sharePrice: string;
  shareValue: string;
  serviceFee: string;
  totalAmount: string;
  status: ShareProjectInvestmentStatus;

  // Relations
  project?: ShareProject;
  investor?: ShareUser;
}

export interface ShareProjectInvestmentCreationAttributes {
  code?: string | null;
  investorName?: string | null;
  investorEmail?: string | null;
  investorPhone?: string | null;
  projectId: string;
  investorId: number;
  quantity: number;
  sharePrice: string;
  shareValue: string;
  serviceFee: string;
  totalAmount: string;
  status?: ShareProjectInvestmentStatus; // Has default value
}

export type ShareProjectInvestmentUpdateAttributes = Partial<ShareProjectInvestmentCreationAttributes>;

// Helper type for including relations
export interface ShareProjectInvestmentWithRelations extends ShareProjectInvestmentAttributes {
  project?: ShareProject;
  investor?: ShareUser;
}
