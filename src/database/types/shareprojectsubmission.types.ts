// Auto-generated types for ShareProjectSubmission
// Source: src/database/models/share-project/share-project-submission.model.ts

import type { ShareProject } from '../models/share-project/share-project.model';

export interface ShareProjectSubmissionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  type: string;
  note?: string | null;
  submittedBy: number;

  // Relations
  project?: ShareProject;
}

export interface ShareProjectSubmissionCreationAttributes {
  projectId: string;
  type: string;
  note?: string | null;
  submittedBy: number;
}

export type ShareProjectSubmissionUpdateAttributes = Partial<ShareProjectSubmissionCreationAttributes>;

// Helper type for including relations
export interface ShareProjectSubmissionWithRelations extends ShareProjectSubmissionAttributes {
  project?: ShareProject;
}
