// Auto-generated types for ShareProjectDocument
// Source: src/database/models/share-project/share-project-document.model.ts

import type { ShareProject } from '../models/share-project/share-project.model';

export interface ShareProjectDocumentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  title: string;
  url: string;
  fileType?: string | null;

  // Relations
  project?: ShareProject;
}

export interface ShareProjectDocumentCreationAttributes {
  projectId: string;
  title: string;
  url: string;
  fileType?: string | null;
}

export type ShareProjectDocumentUpdateAttributes = Partial<ShareProjectDocumentCreationAttributes>;

// Helper type for including relations
export interface ShareProjectDocumentWithRelations extends ShareProjectDocumentAttributes {
  project?: ShareProject;
}
