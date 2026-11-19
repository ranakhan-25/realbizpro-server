// Auto-generated types for ShareProjectCategory
// Source: src/database/models/share-project/share-project-category.model.ts

import type { ShareProject } from '../models/share-project/share-project.model';

export interface ShareProjectCategoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  isActive: boolean;

  // Relations
  projects?: ShareProject[];
}

export interface ShareProjectCategoryCreationAttributes {
  code: string;
  name: string;
  isActive?: boolean; // Has default value
}

export type ShareProjectCategoryUpdateAttributes = Partial<ShareProjectCategoryCreationAttributes>;

// Helper type for including relations
export interface ShareProjectCategoryWithRelations extends ShareProjectCategoryAttributes {
  projects?: ShareProject[];
}
