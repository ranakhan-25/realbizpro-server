// Auto-generated types for LegalDocument
// Source: src\database\models\lams\legal-document.model.ts

import type { AcquisitionLead } from '../models/lams/acquisition-lead.model';

export interface LegalDocumentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: any;
  document_type: string;
  document_number: string;
  issue_date: Date;
  file_path: string;
  verification_status: string;
  vetting_remarks: string;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
  projectId?: string | null;

  // Relations
  acquisition_lead?: AcquisitionLead;
}

export interface LegalDocumentCreationAttributes {
  lead_id: any;
  document_type: string;
  document_number: string;
  issue_date: Date;
  file_path: string;
  verification_status?: string; // Has default value
  vetting_remarks: string;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
  projectId?: string | null;
}

export type LegalDocumentUpdateAttributes = Partial<LegalDocumentCreationAttributes>;

// Helper type for including relations
export interface LegalDocumentWithRelations extends LegalDocumentAttributes {
  acquisition_lead?: AcquisitionLead;
}
