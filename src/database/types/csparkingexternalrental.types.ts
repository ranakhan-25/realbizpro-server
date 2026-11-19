// Auto-generated types for CsParkingExternalRental
// Source: src/database/models/customer-service/cs_parking_external_rental.model.ts

import { ParkingVehicleType } from '../models/customer-service/cs_parking.types';
import { RentalPaymentStatus } from '../models/customer-service/cs_parking.types';
import { ExternalRentalStatus } from '../models/customer-service/cs_parking.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsParkingSlot } from '../models/customer-service/cs_parking_slot.model';

export interface CsParkingExternalRentalAttributes {
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
  renterName: string;
  renterPhone: string;
  renterNid?: string | null;
  vehicleNumber: string;
  vehicleType: ParkingVehicleType;
  monthlyRent: number;
  depositAmount: number;
  startDate: string;
  endDate?: string | null;
  paymentStatus: RentalPaymentStatus;
  amountCollected: number;
  lastPaymentDate?: string | null;
  status: ExternalRentalStatus;
  notes?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  slot?: CsParkingSlot;
}

export interface CsParkingExternalRentalCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  slotId: number;
  renterName: string;
  renterPhone: string;
  renterNid?: string | null;
  vehicleNumber: string;
  vehicleType?: ParkingVehicleType; // Has default value
  monthlyRent?: number; // Has default value
  depositAmount?: number; // Has default value
  startDate: string;
  endDate?: string | null;
  paymentStatus?: RentalPaymentStatus; // Has default value
  amountCollected?: number; // Has default value
  lastPaymentDate?: string | null;
  status?: ExternalRentalStatus; // Has default value
  notes?: string | null;
}

export type CsParkingExternalRentalUpdateAttributes = Partial<CsParkingExternalRentalCreationAttributes>;

// Helper type for including relations
export interface CsParkingExternalRentalWithRelations extends CsParkingExternalRentalAttributes {
  organization?: SysOrganization;
  project?: Project;
  slot?: CsParkingSlot;
}
