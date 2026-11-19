// Auto-generated types for CrmEmployeeKpi
// Source: src/database/models/crm/kpi/crm-employee-kpi.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { LeadTeam } from '../models/crm/lead/crm-lead-master-data.model';

export interface CrmEmployeeKpiAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  type: 'INDIVIDUAL' | 'TEAM';
  name: string;
  userId?: string | null;
  teamId?: number | null;
  workType1: string;
  target1: number;
  workType2: string;
  target2: number;
  workType3: string;
  target3: number;
  fromDate: string;
  toDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  organization?: SysOrganization;
  user?: SysUser;
  team?: LeadTeam;
}

export interface CrmEmployeeKpiCreationAttributes {
  type: 'INDIVIDUAL' | 'TEAM';
  name: string;
  userId?: string | null;
  teamId?: number | null;
  workType1: string;
  target1: number;
  workType2: string;
  target2: number;
  workType3: string;
  target3: number;
  fromDate: string;
  toDate: string;
  status?: 'ACTIVE' | 'INACTIVE'; // Has default value
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type CrmEmployeeKpiUpdateAttributes = Partial<CrmEmployeeKpiCreationAttributes>;

// Helper type for including relations
export interface CrmEmployeeKpiWithRelations extends CrmEmployeeKpiAttributes {
  organization?: SysOrganization;
  user?: SysUser;
  team?: LeadTeam;
}
