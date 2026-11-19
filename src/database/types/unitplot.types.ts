// Auto-generated types for UnitPlot
// Source: src/database/models/projects/unit_plot/pr_unit_plot_model.ts

import { PlotType } from '../models/projects/unit_plot/pr_unit_plot_model';
import { PlotFacing } from '../models/projects/unit_plot/pr_unit_plot_model';
import { PlotStatus } from '../models/projects/unit_plot/pr_unit_plot_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface UnitPlotAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  floorUuid: string;
  plotCode: string;
  plotType: PlotType;
  sizeSqft: number;
  facing: PlotFacing;
  basePrice: number;
  floorRise: number;
  premium: number;
  amenities?: string | null;
  status: PlotStatus;
  notes?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface UnitPlotCreationAttributes {
  floorUuid: string;
  plotCode: string;
  plotType: PlotType;
  sizeSqft?: number; // Has default value
  facing: PlotFacing;
  basePrice?: number; // Has default value
  floorRise?: number; // Has default value
  premium?: number; // Has default value
  amenities?: string | null;
  status?: PlotStatus; // Has default value
  notes?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type UnitPlotUpdateAttributes = Partial<UnitPlotCreationAttributes>;

// Helper type for including relations
export interface UnitPlotWithRelations extends UnitPlotAttributes {
  organization?: SysOrganization;
  project?: Project;
}
