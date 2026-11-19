// Auto-generated types for Agent
// Source: src/database/models/sales_management/sm_commission_form_agent_model.ts

import type { Commission } from '../models/hrm/employee/hrm_commission_model';

export interface AgentAttributes {
  uuid: string;
  name: string;
  role: string | null;
  deals: number;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  commissions: Commission[];
}

export interface AgentCreationAttributes {
  uuid?: string; // Auto increment
  name: string;
  role?: string | null; // Nullable
  deals?: number; // Has default value
  avatar?: string | null; // Nullable
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type AgentUpdateAttributes = Partial<AgentCreationAttributes>;

// Helper type for including relations
export interface AgentWithRelations extends AgentAttributes {
  commissions: Commission[];
}
