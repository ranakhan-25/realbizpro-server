// Auto-generated types for ShareProject
// Source: src/database/models/share-project/share-project.model.ts

import { ShareProjectStatus } from '../models/share-project/share-project.model';

import type { ShareUser } from '../models/share-user/share-user.model';
import type { ShareProjectCategory } from '../models/share-project/share-project-category.model';
import type { ShareProjectImage } from '../models/share-project/share-project-image.model';
import type { ShareProjectDocument } from '../models/share-project/share-project-document.model';
import type { ShareProjectSubmission } from '../models/share-project/share-project-submission.model';
import type { ShareProjectReview } from '../models/share-project/share-project-review.model';
import type { ShareProjectStatusHistory } from '../models/share-project/share-project-status-history.model';

export interface ShareProjectAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code?: string | null;
  creatorName?: string | null;
  creatorEmail?: string | null;
  creatorPhone?: string | null;
  companyName?: string | null;
  ownerId: number;
  categoryId: number;
  name: string;
  description: string;
  location?: string | null;
  totalInvestmentAmount: string;
  totalShares: number;
  pricePerShare: string;
  minimumInvestment: string;
  expectedAnnualReturn?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  thumbnailUrl?: string | null;
  status: ShareProjectStatus;
  rejectionReason?: string | null;
  submittedAt?: Date | null;
  publishedAt?: Date | null;

  // Relations
  owner?: ShareUser;
  category?: ShareProjectCategory;
  images?: ShareProjectImage[];
  documents?: ShareProjectDocument[];
  submissions?: ShareProjectSubmission[];
  reviews?: ShareProjectReview[];
  statusHistory?: ShareProjectStatusHistory[];
}

export interface ShareProjectCreationAttributes {
  code?: string | null;
  creatorName?: string | null;
  creatorEmail?: string | null;
  creatorPhone?: string | null;
  companyName?: string | null;
  ownerId: number;
  categoryId: number;
  name: string;
  description: string;
  location?: string | null;
  totalInvestmentAmount: string;
  totalShares: number;
  pricePerShare: string;
  minimumInvestment: string;
  expectedAnnualReturn?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  thumbnailUrl?: string | null;
  status?: ShareProjectStatus; // Has default value
  rejectionReason?: string | null;
  submittedAt?: Date | null;
  publishedAt?: Date | null;
}

export type ShareProjectUpdateAttributes = Partial<ShareProjectCreationAttributes>;

// Helper type for including relations
export interface ShareProjectWithRelations extends ShareProjectAttributes {
  owner?: ShareUser;
  category?: ShareProjectCategory;
  images?: ShareProjectImage[];
  documents?: ShareProjectDocument[];
  submissions?: ShareProjectSubmission[];
  reviews?: ShareProjectReview[];
  statusHistory?: ShareProjectStatusHistory[];
}
