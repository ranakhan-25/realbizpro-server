// Auto-generated types for FlatLandOffer
// Source: src/database/models/projects/flat-land-offer/pr_flat_land_offer.model.ts

import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLand } from '../models/projects/flatland/pr_flatland.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface FlatLandOfferAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  flatLandId?: string | null;
  code: string;
  offerDate: Date;
  customerName?: string | null;
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
  approvalStatus?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  project?: Project;
  flatLand?: FlatLand;
  organization?: SysOrganization;
}

export interface FlatLandOfferCreationAttributes {
  projectId: string;
  flatLandId?: string | null;
  code: string;
  offerDate: Date;
  customerName?: string | null;
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
  approvalStatus?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type FlatLandOfferUpdateAttributes = Partial<FlatLandOfferCreationAttributes>;

// Helper type for including relations
export interface FlatLandOfferWithRelations extends FlatLandOfferAttributes {
  project?: Project;
  flatLand?: FlatLand;
  organization?: SysOrganization;
}
