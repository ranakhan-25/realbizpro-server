// Auto-generated types for CsOwnersAssociation
// Source: src/database/models/customer-service/cs_owners_association.model.ts

import { AssociationGovernanceStatus } from '../models/customer-service/cs_property_care.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CsOwnersAssociationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName: string;
  associationCode: string;
  associationName: string;
  presidentName: string;
  contactPhone?: string | null;
  totalFlats: number;
  handedOverCount: number;
  monthlyServiceChargePerFlat: number;
  associationBankAcc?: string | null;
  handoverStatus: AssociationGovernanceStatus;
  transitionDate?: string | null;
  remarks?: string | null;

  // Relations
  organization?: SysOrganization;
  projectDetails?: Project;
}

export interface CsOwnersAssociationCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName: string;
  associationCode: string;
  associationName: string;
  presidentName: string;
  contactPhone?: string | null;
  totalFlats?: number; // Has default value
  handedOverCount?: number; // Has default value
  monthlyServiceChargePerFlat?: number; // Has default value
  associationBankAcc?: string | null;
  handoverStatus?: AssociationGovernanceStatus; // Has default value
  transitionDate?: string | null;
  remarks?: string | null;
}

export type CsOwnersAssociationUpdateAttributes = Partial<CsOwnersAssociationCreationAttributes>;

// Helper type for including relations
export interface CsOwnersAssociationWithRelations extends CsOwnersAssociationAttributes {
  organization?: SysOrganization;
  projectDetails?: Project;
}
