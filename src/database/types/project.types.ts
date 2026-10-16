// Auto-generated types for Project
// Source: src\database\models\projects\project\pr_project.model.ts

import { ProjectStatus } from '../models/projects/project/pr_project.model';

import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { ShareConfiguration } from '../models/projects/investor/configuration.model';
import type { MaterialRequisition } from '../models/projects/material-requisition/pr_material_requisition.model';
import type { ProjectDocument } from '../models/projects/project-document/pr_project_document.model';
import type { ProjectShareAssignment } from '../models/projects/project-share-assignment/pr_project_share_assignment.model';
import type { ProjectShareConfiguration } from '../models/projects/project-share-configuration/pr_project_share_configuration.model';
import type { FlatLand } from '../models/projects/flatland/pr_flatland.model';
import type { LandInfrastructure } from '../models/projects/land-infrastructure/pr_land_infrastructure.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { FlatLandOffer } from '../models/projects/flat-land-offer/pr_flat_land_offer.model';
import type { ProjectBillingRecord } from '../models/projects/billing/pr_project_billing_record.model';
import type { ProjectTeamMember } from '../models/projects/project-team-member/pr_project_team_member.model';
import type { Boq } from '../models/projects/boq/pr_boq.model';

export interface ProjectAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  projectType?: string | null;
  areaCategory?: string | null;
  location?: string | null;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  contactPersonName?: string | null;
  contactPhone?: string | null;
  clientEmail?: string | null;
  contractorCompany?: string | null;
  projectManager?: string | null;
  totalBudget?: number | null;
  numberOfStoreys?: number | null;
  progressPercentage?: number | null;
  status: ProjectStatus;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  sites?: Site[];
  shareConfigurations?: ShareConfiguration[];
  materialRequisitions?: MaterialRequisition[];
  documents?: ProjectDocument[];
  shareAssignments?: ProjectShareAssignment[];
  projectShareConfigurations?: ProjectShareConfiguration[];
  flatLandItems?: FlatLand[];
  landInfrastructure?: LandInfrastructure[];
  flatLandBookings?: FlatLandBooking[];
  flatLandOffers?: FlatLandOffer[];
  billingRecords?: ProjectBillingRecord[];
  teamMembers?: ProjectTeamMember[];
  boqs: Boq[];
}

export interface ProjectCreationAttributes {
  code: string;
  name: string;
  projectType?: string | null;
  areaCategory?: string | null;
  location?: string | null;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  contactPersonName?: string | null;
  contactPhone?: string | null;
  clientEmail?: string | null;
  contractorCompany?: string | null;
  projectManager?: string | null;
  totalBudget?: number | null;
  numberOfStoreys?: number | null;
  progressPercentage?: number | null;
  status?: ProjectStatus; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProjectUpdateAttributes = Partial<ProjectCreationAttributes>;

// Helper type for including relations
export interface ProjectWithRelations extends ProjectAttributes {
  sites?: Site[];
  shareConfigurations?: ShareConfiguration[];
  materialRequisitions?: MaterialRequisition[];
  documents?: ProjectDocument[];
  shareAssignments?: ProjectShareAssignment[];
  projectShareConfigurations?: ProjectShareConfiguration[];
  flatLandItems?: FlatLand[];
  landInfrastructure?: LandInfrastructure[];
  flatLandBookings?: FlatLandBooking[];
  flatLandOffers?: FlatLandOffer[];
  billingRecords?: ProjectBillingRecord[];
  teamMembers?: ProjectTeamMember[];
  boqs: Boq[];
}
