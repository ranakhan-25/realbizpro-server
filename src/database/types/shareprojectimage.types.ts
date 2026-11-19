// Auto-generated types for ShareProjectImage
// Source: src/database/models/share-project/share-project-image.model.ts

import type { ShareProject } from '../models/share-project/share-project.model';

export interface ShareProjectImageAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  url: string;
  altText?: string | null;
  sortOrder: number;

  // Relations
  project?: ShareProject;
}

export interface ShareProjectImageCreationAttributes {
  projectId: string;
  url: string;
  altText?: string | null;
  sortOrder?: number; // Has default value
}

export type ShareProjectImageUpdateAttributes = Partial<ShareProjectImageCreationAttributes>;

// Helper type for including relations
export interface ShareProjectImageWithRelations extends ShareProjectImageAttributes {
  project?: ShareProject;
}
