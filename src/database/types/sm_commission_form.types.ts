// Auto-generated types for Commission
// Source: src/database/models/sales_management/sm_commission_form_model.ts

import { PropertyType } from '../models/sales_management/sm_commission_form_model';
import { CommissionType } from '../models/sales_management/sm_commission_form_model';

import type { Agent } from '../models/sales_management/sm_commission_form_agent_model';

export interface CommissionAttributes {
  uuid: string;
  agentUuid: string;
  propertyType: PropertyType;
  commissionType: CommissionType;
  baseAmount: number | null;
  percentage: number | null;
  minCommission: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  agent?: Agent;
}

export interface CommissionCreationAttributes {
  uuid?: string; // Auto increment
  agentUuid: string;
  propertyType: PropertyType;
  commissionType?: CommissionType; // Has default value
  baseAmount?: number | null; // Nullable
  percentage?: number | null; // Nullable
  minCommission?: number | null; // Has default value
  notes?: string | null; // Nullable
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type CommissionUpdateAttributes = Partial<CommissionCreationAttributes>;

// Helper type for including relations
export interface CommissionWithRelations extends CommissionAttributes {
  agent?: Agent;
}
