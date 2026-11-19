// Auto-generated types for ShareProjectReview
// Source: src/database/models/share-project/share-project-review.model.ts

import { ShareProjectReviewDecision } from '../models/share-project/share-project-review.model';

import type { ShareProject } from '../models/share-project/share-project.model';
import type { ShareUser } from '../models/share-user/share-user.model';

export interface ShareProjectReviewAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  reviewedBy: number;
  decision: ShareProjectReviewDecision;
  reason?: string | null;

  // Relations
  project?: ShareProject;
  reviewer?: ShareUser;
}

export interface ShareProjectReviewCreationAttributes {
  projectId: string;
  reviewedBy: number;
  decision: ShareProjectReviewDecision;
  reason?: string | null;
}

export type ShareProjectReviewUpdateAttributes = Partial<ShareProjectReviewCreationAttributes>;

// Helper type for including relations
export interface ShareProjectReviewWithRelations extends ShareProjectReviewAttributes {
  project?: ShareProject;
  reviewer?: ShareUser;
}
