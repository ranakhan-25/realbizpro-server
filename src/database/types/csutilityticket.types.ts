// Auto-generated types for CsUtilityTicket
// Source: src/database/models/customer-service/cs_utility_ticket.model.ts

import { UtilityTicketCategory } from '../models/customer-service/cs_utility.types';
import { UtilityTicketPriority } from '../models/customer-service/cs_utility.types';
import { UtilityTicketStatus } from '../models/customer-service/cs_utility.types';
import { UtilityTicketCostType } from '../models/customer-service/cs_utility.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsUtilityTechnician } from '../models/customer-service/cs_utility_technician.model';
import type { CsWarrantyItem } from '../models/customer-service/cs_warranty_item.model';

export interface CsUtilityTicketAttributes {
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
  ticketNumber: string;
  queueSerial: number;
  unit: string;
  customerName: string;
  customerPhone?: string | null;
  category: UtilityTicketCategory;
  description: string;
  priority: UtilityTicketPriority;
  status: UtilityTicketStatus;
  technicianId?: number | null;
  warrantyItemId?: number | null;
  costType: UtilityTicketCostType;
  estimatedCharge: number;
  actualCharge?: number | null;
  assignedAt?: Date | null;
  resolvedAt?: Date | null;
  handedOverAt?: Date | null;
  closedAt?: Date | null;
  resolutionNotes?: string | null;
  customerFeedback?: string | null;
  customerRating?: number | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  technician?: CsUtilityTechnician;
  warrantyItem?: CsWarrantyItem;
}

export interface CsUtilityTicketCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  ticketNumber: string;
  queueSerial: number;
  unit: string;
  customerName: string;
  customerPhone?: string | null;
  category: UtilityTicketCategory;
  description: string;
  priority?: UtilityTicketPriority; // Has default value
  status?: UtilityTicketStatus; // Has default value
  technicianId?: number | null;
  warrantyItemId?: number | null;
  costType?: UtilityTicketCostType; // Has default value
  estimatedCharge?: number; // Has default value
  actualCharge?: number | null;
  assignedAt?: Date | null;
  resolvedAt?: Date | null;
  handedOverAt?: Date | null;
  closedAt?: Date | null;
  resolutionNotes?: string | null;
  customerFeedback?: string | null;
  customerRating?: number | null;
}

export type CsUtilityTicketUpdateAttributes = Partial<CsUtilityTicketCreationAttributes>;

// Helper type for including relations
export interface CsUtilityTicketWithRelations extends CsUtilityTicketAttributes {
  organization?: SysOrganization;
  project?: Project;
  technician?: CsUtilityTechnician;
  warrantyItem?: CsWarrantyItem;
}
