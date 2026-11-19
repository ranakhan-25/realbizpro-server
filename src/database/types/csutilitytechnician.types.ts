// Auto-generated types for CsUtilityTechnician
// Source: src/database/models/customer-service/cs_utility_technician.model.ts

import { TechnicianSpecialty } from '../models/customer-service/cs_utility.types';
import { TechnicianType } from '../models/customer-service/cs_utility.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CsUtilityTechnicianAttributes {
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
  name: string;
  phone: string;
  specialty: TechnicianSpecialty;
  technicianType: TechnicianType;
  vendorName?: string | null;
  isActive: boolean;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface CsUtilityTechnicianCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  name: string;
  phone: string;
  specialty: TechnicianSpecialty;
  technicianType?: TechnicianType; // Has default value
  vendorName?: string | null;
  isActive?: boolean; // Has default value
}

export type CsUtilityTechnicianUpdateAttributes = Partial<CsUtilityTechnicianCreationAttributes>;

// Helper type for including relations
export interface CsUtilityTechnicianWithRelations extends CsUtilityTechnicianAttributes {
  organization?: SysOrganization;
  project?: Project;
}
