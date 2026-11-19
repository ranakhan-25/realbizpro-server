// Auto-generated types for ShareProjectStatusHistory
// Source: src/database/models/share-project/share-project-status-history.model.ts

import type { ShareProject } from '../models/share-project/share-project.model';

export interface ShareProjectStatusHistoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  fromStatus: string;
  toStatus: string;
  changedBy?: number | null;
  note?: string | null;

  // Relations
  project?: ShareProject;
}

export interface ShareProjectStatusHistoryCreationAttributes {
  projectId: string;
  fromStatus: string;
  toStatus: string;
  changedBy?: number | null;
  note?: string | null;
}

export type ShareProjectStatusHistoryUpdateAttributes = Partial<ShareProjectStatusHistoryCreationAttributes>;

// Helper type for including relations
export interface ShareProjectStatusHistoryWithRelations extends ShareProjectStatusHistoryAttributes {
  project?: ShareProject;
}
