// Auto-generated types for CsMaintenanceRequest
// Source: src/database/models/customer-service/cs_maintenance_request.model.ts

import { MaintenanceType } from '../models/customer-service/cs_property_care.types';
import { MaintenanceStatus } from '../models/customer-service/cs_property_care.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CsMaintenanceRequestAttributes {
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
  projectName?: string | null;
  requestNo: string;
  facility: string;
  maintenanceType: MaintenanceType;
  scheduledDate: string;
  vendorName: string;
  vendorId?: number | null;
  costEstimate: number;
  actualCost?: number | null;
  status: MaintenanceStatus;
  completionDate?: string | null;
  remarks?: string | null;

  // Relations
  organization?: SysOrganization;
  projectDetails?: Project;
}

export interface CsMaintenanceRequestCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName?: string | null;
  requestNo: string;
  facility: string;
  maintenanceType?: MaintenanceType; // Has default value
  scheduledDate?: string; // Has default value
  vendorName?: string; // Has default value
  vendorId?: number | null;
  costEstimate?: number; // Has default value
  actualCost?: number | null;
  status?: MaintenanceStatus; // Has default value
  completionDate?: string | null;
  remarks?: string | null;
}

export type CsMaintenanceRequestUpdateAttributes = Partial<CsMaintenanceRequestCreationAttributes>;

// Helper type for including relations
export interface CsMaintenanceRequestWithRelations extends CsMaintenanceRequestAttributes {
  organization?: SysOrganization;
  projectDetails?: Project;
}
