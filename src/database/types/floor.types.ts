// Auto-generated types for Floor
// Source: src/database/models/projects/floor/pr_floor_model.ts

import type { Building } from '../models/projects/building/pr_building_model';
import type { UnitPlot } from '../models/projects/unit_plot/pr_unit_plot_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface FloorAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  buildingUuid: string;
  floorCode: string;
  floorName: string;
  floorNumber: number;
  unitsCount: number;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  building: Building;
  unitPlots: UnitPlot[];
  organization?: SysOrganization;
  project?: Project;
}

export interface FloorCreationAttributes {
  buildingUuid: string;
  floorCode: string;
  floorName: string;
  floorNumber?: number; // Has default value
  unitsCount?: number; // Has default value
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type FloorUpdateAttributes = Partial<FloorCreationAttributes>;

// Helper type for including relations
export interface FloorWithRelations extends FloorAttributes {
  building: Building;
  unitPlots: UnitPlot[];
  organization?: SysOrganization;
  project?: Project;
}
