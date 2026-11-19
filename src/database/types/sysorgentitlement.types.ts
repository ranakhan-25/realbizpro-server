// Auto-generated types for SysOrgEntitlement
// Source: src/database/models/system/sys_org_entitlement.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { SysModules } from '../models/system/sys_module.model';
import type { SysFeatures } from '../models/system/sys_features.model';

export interface SysOrgEntitlementAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  orgId: number;
  orgUuid?: string | null;
  moduleId: number;
  moduleUuid?: string | null;
  featureId: number;
  featureUuid?: string | null;
  isEnabled: boolean;

  // Relations
  organization?: SysOrganization;
  module?: SysModules;
  feature?: SysFeatures;
}

export interface SysOrgEntitlementCreationAttributes {
  orgId: number;
  orgUuid?: string | null;
  moduleId: number;
  moduleUuid?: string | null;
  featureId: number;
  featureUuid?: string | null;
  isEnabled?: boolean; // Has default value
}

export type SysOrgEntitlementUpdateAttributes = Partial<SysOrgEntitlementCreationAttributes>;

// Helper type for including relations
export interface SysOrgEntitlementWithRelations extends SysOrgEntitlementAttributes {
  organization?: SysOrganization;
  module?: SysModules;
  feature?: SysFeatures;
}
