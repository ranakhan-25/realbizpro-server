// Auto-generated types for ShareConfiguration
// Source: src\database\models\projects\investor\configuration.model.ts

import { ShareConfigurationStatus } from '../models/projects/investor/configuration.model';

import type { Project } from '../models/projects/project/pr_project.model';
import type { Investor } from '../models/projects/investor/investor.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ShareConfigurationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  investorId: string;
  investmentAmount: number;
  profitPercent?: number | null;
  fixedProfitAmount?: number | null;
  isProfitDistribute: boolean;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: ShareConfigurationStatus;
  orgId?: number | null;

  // Relations
  project?: Project;
  investor?: Investor;
  organization?: SysOrganization;
}

export interface ShareConfigurationCreationAttributes {
  projectId: string;
  investorId: string;
  investmentAmount?: number; // Has default value
  profitPercent?: number | null;
  fixedProfitAmount?: number | null;
  isProfitDistribute?: boolean; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: ShareConfigurationStatus; // Has default value
  orgId?: number | null;
}

export type ShareConfigurationUpdateAttributes = Partial<ShareConfigurationCreationAttributes>;

// Helper type for including relations
export interface ShareConfigurationWithRelations extends ShareConfigurationAttributes {
  project?: Project;
  investor?: Investor;
  organization?: SysOrganization;
}
