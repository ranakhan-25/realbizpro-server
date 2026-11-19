// Auto-generated types for CsParkingSlot
// Source: src/database/models/customer-service/cs_parking_slot.model.ts

import { ParkingVehicleType } from '../models/customer-service/cs_parking.types';
import { ParkingSlotStatus } from '../models/customer-service/cs_parking.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsParkingAssignment } from '../models/customer-service/cs_parking_assignment.model';
import type { CsParkingExternalRental } from '../models/customer-service/cs_parking_external_rental.model';

export interface CsParkingSlotAttributes {
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
  slotNumber: string;
  floorZone: string;
  allowedVehicleType: ParkingVehicleType;
  status: ParkingSlotStatus;
  notes?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  assignments?: CsParkingAssignment[];
  rentals?: CsParkingExternalRental[];
}

export interface CsParkingSlotCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  slotNumber: string;
  floorZone?: string; // Has default value
  allowedVehicleType?: ParkingVehicleType; // Has default value
  status?: ParkingSlotStatus; // Has default value
  notes?: string | null;
}

export type CsParkingSlotUpdateAttributes = Partial<CsParkingSlotCreationAttributes>;

// Helper type for including relations
export interface CsParkingSlotWithRelations extends CsParkingSlotAttributes {
  organization?: SysOrganization;
  project?: Project;
  assignments?: CsParkingAssignment[];
  rentals?: CsParkingExternalRental[];
}
