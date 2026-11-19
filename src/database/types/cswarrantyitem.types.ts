// Auto-generated types for CsWarrantyItem
// Source: src/database/models/customer-service/cs_warranty_item.model.ts

import { WarrantyItemCategory } from '../models/customer-service/cs_utility.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';

export interface CsWarrantyItemAttributes {
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
  unit: string;
  customerName?: string | null;
  customerProfileId?: number | null;
  itemName: string;
  category: WarrantyItemCategory;
  brand: string;
  modelNo?: string | null;
  serialNumber?: string | null;
  location: string;
  quantity: number;
  warrantyStartDate: string;
  warrantyEndDate: string;
  coverageDetails?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  customerProfile?: CsCustomerProfile;
}

export interface CsWarrantyItemCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  unit: string;
  customerName?: string | null;
  customerProfileId?: number | null;
  itemName: string;
  category: WarrantyItemCategory;
  brand: string;
  modelNo?: string | null;
  serialNumber?: string | null;
  location: string;
  quantity?: number; // Has default value
  warrantyStartDate: string;
  warrantyEndDate: string;
  coverageDetails?: string | null;
}

export type CsWarrantyItemUpdateAttributes = Partial<CsWarrantyItemCreationAttributes>;

// Helper type for including relations
export interface CsWarrantyItemWithRelations extends CsWarrantyItemAttributes {
  organization?: SysOrganization;
  project?: Project;
  customerProfile?: CsCustomerProfile;
}
