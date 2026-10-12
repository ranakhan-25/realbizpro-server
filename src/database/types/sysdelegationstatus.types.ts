// Auto-generated types for SysDelegationStatus
// Source: src/database/models/deligation/sys_delegation_statuses.model.ts

export interface SysDelegationStatusAttributes {
  module?: string | null;
  label: string;
  color?: string | null;
  description?: string | null;
  isFinal: boolean;
}

export interface SysDelegationStatusCreationAttributes {
  module?: string | null;
  label: string;
  color?: string | null;
  description?: string | null;
  isFinal?: boolean; // Has default value
}

export type SysDelegationStatusUpdateAttributes = Partial<SysDelegationStatusCreationAttributes>;

// Helper type for including relations
export interface SysDelegationStatusWithRelations extends SysDelegationStatusAttributes {
  // No relations defined
}
