// Auto-generated types for FlatLandBooking
// Source: src\database\models\projects\flat-land-booking\pr_flat_land_booking.model.ts

import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLand } from '../models/projects/flatland/pr_flatland.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface FlatLandBookingAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  flatLandId: string;
  code: string;
  bookingDate: Date;
  customerName: string;
  salesBy?: string | null;
  rate: number;
  otherCost: number;
  parking: number;
  utilityCharge: number;
  discount: number;
  subtotal: number;
  grandTotal: number;
  paid: number;
  due: number;
  attachment?: string | null;
  status: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  project?: Project;
  flatLand?: FlatLand;
  organization?: SysOrganization;
}

export interface FlatLandBookingCreationAttributes {
  projectId: string;
  flatLandId: string;
  code: string;
  bookingDate: Date;
  customerName: string;
  salesBy?: string | null;
  rate?: number; // Has default value
  otherCost?: number; // Has default value
  parking?: number; // Has default value
  utilityCharge?: number; // Has default value
  discount?: number; // Has default value
  subtotal?: number; // Has default value
  grandTotal?: number; // Has default value
  paid?: number; // Has default value
  due?: number; // Has default value
  attachment?: string | null;
  status?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type FlatLandBookingUpdateAttributes = Partial<FlatLandBookingCreationAttributes>;

// Helper type for including relations
export interface FlatLandBookingWithRelations extends FlatLandBookingAttributes {
  project?: Project;
  flatLand?: FlatLand;
  organization?: SysOrganization;
}
