// Auto-generated types for LandInfrastructure
// Source: src\database\models\projects\land-infrastructure\pr_land_infrastructure.model.ts

import { LandInfrastructureKind } from '../models/projects/land-infrastructure/pr_land_infrastructure.model';

import type { Project } from '../models/projects/project/pr_project.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface LandInfrastructureAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  kind: LandInfrastructureKind;
  name: string;
  size?: string | null;
  details?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  project?: Project;
  organization?: SysOrganization;
}

export interface LandInfrastructureCreationAttributes {
  projectId: string;
  kind: LandInfrastructureKind;
  name: string;
  size?: string | null;
  details?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type LandInfrastructureUpdateAttributes = Partial<LandInfrastructureCreationAttributes>;

// Helper type for including relations
export interface LandInfrastructureWithRelations extends LandInfrastructureAttributes {
  project?: Project;
  organization?: SysOrganization;
}
