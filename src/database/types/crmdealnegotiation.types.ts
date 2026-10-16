// Auto-generated types for CrmDealNegotiation
// Source: src\database\models\crm\crm_deal_negotiation.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmDealNegotiationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: number;
  property_id?: string | null;
  offer_price: number;
  agreed_price?: number | null;
  discount_amount?: number | null;
  special_terms?: string | null;
  approval_status: string;
  approved_by?: string | null;
  approval_date?: Date | null;
  rejection_reason?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  lead: CrmLead;
}

export interface CrmDealNegotiationCreationAttributes {
  lead_id: number;
  property_id?: string | null;
  offer_price: number;
  agreed_price?: number | null;
  discount_amount?: number | null;
  special_terms?: string | null;
  approval_status?: string; // Has default value
  approved_by?: string | null;
  approval_date?: Date | null;
  rejection_reason?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmDealNegotiationUpdateAttributes = Partial<CrmDealNegotiationCreationAttributes>;

// Helper type for including relations
export interface CrmDealNegotiationWithRelations extends CrmDealNegotiationAttributes {
  lead: CrmLead;
}
