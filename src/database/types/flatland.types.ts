// Auto-generated types for FlatLand
// Source: src/database/models/projects/flatland/pr_flatland.model.ts

import { FlatLandStatus } from '../models/projects/flatland/pr_flatland.model';

import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { FlatLandOffer } from '../models/projects/flat-land-offer/pr_flat_land_offer.model';
import type { CrmLeadNegotiation } from '../models/crm/call-center/crm-lead-negotiation.model';

export interface FlatLandAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId?: string | null;
  uid?: string | null;
  projectName: string;
  propertyType: 'flat' | 'land';
  siteBlock?: string | null;
  siteName?: string | null;
  blockName?: string | null;
  roadNo?: string | null;
  roadSize?: string | null;
  plotLocation?: string | null;
  flatLandNo: string;
  unit?: string | null;
  bedroom?: number | null;
  bathroom?: number | null;
  size?: string | null;
  pricePerUnit?: number | null;
  parkingCost?: number | null;
  utilityCharge?: number | null;
  customerName?: string | null;
  facing?: string | null;
  amenities?: string | null;
  drawing?: string | null;
  dining?: string | null;
  kitchen?: string | null;
  balcony?: string | null;
  parking?: string | null;
  basement?: string | null;
  subtotal?: number | null;
  grandTotal?: number | null;
  status: FlatLandStatus;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  project?: Project;
  bookings?: FlatLandBooking[];
  offers?: FlatLandOffer[];
  crmNegotiations?: CrmLeadNegotiation[];
}

export interface FlatLandCreationAttributes {
  projectId?: string | null;
  uid?: string | null;
  projectName: string;
  propertyType?: 'flat' | 'land'; // Has default value
  siteBlock?: string | null;
  siteName?: string | null;
  blockName?: string | null;
  roadNo?: string | null;
  roadSize?: string | null;
  plotLocation?: string | null;
  flatLandNo: string;
  unit?: string | null;
  bedroom?: number | null;
  bathroom?: number | null;
  size?: string | null;
  pricePerUnit?: number | null;
  parkingCost?: number | null;
  utilityCharge?: number | null;
  customerName?: string | null;
  facing?: string | null;
  amenities?: string | null;
  drawing?: string | null;
  dining?: string | null;
  kitchen?: string | null;
  balcony?: string | null;
  parking?: string | null;
  basement?: string | null;
  subtotal?: number | null;
  grandTotal?: number | null;
  status?: FlatLandStatus; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type FlatLandUpdateAttributes = Partial<FlatLandCreationAttributes>;

// Helper type for including relations
export interface FlatLandWithRelations extends FlatLandAttributes {
  project?: Project;
  bookings?: FlatLandBooking[];
  offers?: FlatLandOffer[];
  crmNegotiations?: CrmLeadNegotiation[];
}
