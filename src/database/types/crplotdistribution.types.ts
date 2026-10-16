// Auto-generated types for CrPlotDistribution
// Source: src/database/models/credit-realization/cr_plot_distribution.model.ts

import type { CrSaleAgreement } from '../models/credit-realization/cr_sale_agreement.model';

export interface CrPlotDistributionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  sale_agreement_id: number;
  plot_no: string;
  road_no?: string | null;
  sector_block?: string | null;
  plot_size_katha?: number | null;
  facing?: string | null;
  allotment_status: string;
  allotment_letter_no?: string | null;
  allotment_date?: string | null;
  registration_date?: string | null;
  mutation_date?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  sale_agreement: CrSaleAgreement;
}

export interface CrPlotDistributionCreationAttributes {
  sale_agreement_id: number;
  plot_no: string;
  road_no?: string | null;
  sector_block?: string | null;
  plot_size_katha?: number | null;
  facing?: string | null;
  allotment_status?: string; // Has default value
  allotment_letter_no?: string | null;
  allotment_date?: string | null;
  registration_date?: string | null;
  mutation_date?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrPlotDistributionUpdateAttributes = Partial<CrPlotDistributionCreationAttributes>;

// Helper type for including relations
export interface CrPlotDistributionWithRelations extends CrPlotDistributionAttributes {
  sale_agreement: CrSaleAgreement;
}
