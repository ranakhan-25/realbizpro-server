// Auto-generated types for Invoice
// Source: src/database/models/projects/billing/pr_invoice.model.ts

import type { CustomerAccount } from '../models/projects/contract/pr_customer_accounts.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { ProjectType } from '../models/projects/project-type/pr_project_type.model';
import type { InvoiceItem } from '../models/projects/billing/pr_invoice_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface InvoiceAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  date: string;
  customerId?: string | null;
  projectId?: string | null;
  projectTypeId?: string | null;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod?: string | null;
  approvalStatus?: string | null;
  contentBody?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  customer?: CustomerAccount;
  project?: Project;
  projectType?: ProjectType;
  items?: InvoiceItem[];
  organization?: SysOrganization;
}

export interface InvoiceCreationAttributes {
  code: string;
  date: string;
  customerId?: string | null;
  projectId?: string | null;
  projectTypeId?: string | null;
  grandTotal?: number; // Has default value
  paidAmount?: number; // Has default value
  dueAmount?: number; // Has default value
  paymentMethod?: string | null;
  approvalStatus?: string | null;
  contentBody?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type InvoiceUpdateAttributes = Partial<InvoiceCreationAttributes>;

// Helper type for including relations
export interface InvoiceWithRelations extends InvoiceAttributes {
  customer?: CustomerAccount;
  project?: Project;
  projectType?: ProjectType;
  items?: InvoiceItem[];
  organization?: SysOrganization;
}
