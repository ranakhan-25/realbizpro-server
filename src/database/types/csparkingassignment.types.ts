// Auto-generated types for CsParkingAssignment
// Source: src/database/models/customer-service/cs_parking_assignment.model.ts

import { ParkingVehicleType } from '../models/customer-service/cs_parking.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsParkingSlot } from '../models/customer-service/cs_parking_slot.model';

export interface CsParkingAssignmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  slotId: number;
  flatNumber: string;
  residentName: string;
  residentPhone?: string | null;
  vehicleNumber: string;
  vehicleType: ParkingVehicleType;
  rfidTag?: string | null;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  releaseDate?: string | null;
  releaseReason?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  slot?: CsParkingSlot;
}

export interface CsParkingAssignmentCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  slotId: number;
  flatNumber: string;
  residentName: string;
  residentPhone?: string | null;
  vehicleNumber: string;
  vehicleType?: ParkingVehicleType; // Has default value
  rfidTag?: string | null;
  startDate: string;
  endDate?: string | null;
  isActive?: boolean; // Has default value
  releaseDate?: string | null;
  releaseReason?: string | null;
}

export type CsParkingAssignmentUpdateAttributes = Partial<CsParkingAssignmentCreationAttributes>;

// Helper type for including relations
export interface CsParkingAssignmentWithRelations extends CsParkingAssignmentAttributes {
  organization?: SysOrganization;
  project?: Project;
  slot?: CsParkingSlot;
}
