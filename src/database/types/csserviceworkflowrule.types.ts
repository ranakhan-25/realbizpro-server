// Auto-generated types for CsServiceWorkflowRule
// Source: src/database/models/customer-service/cs_service_workflow_rule.model.ts

import { ServiceRuleType } from '../models/customer-service/cs_rules.types';
import { ServiceRuleStatus } from '../models/customer-service/cs_rules.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CsServiceWorkflowRuleAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName?: string | null;
  ruleCode: string;
  ruleName: string;
  ruleType: ServiceRuleType;
  categoryOrTrigger: string;
  firstResponseTarget: string;
  resolutionTarget: string;
  escalationTarget?: string | null;
  assignedDepartment: string;
  operatingHours: string;
  status: ServiceRuleStatus;

  // Relations
  organization?: SysOrganization;
  projectDetails?: Project;
}

export interface CsServiceWorkflowRuleCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName?: string | null;
  ruleCode: string;
  ruleName: string;
  ruleType?: ServiceRuleType; // Has default value
  categoryOrTrigger: string;
  firstResponseTarget?: string; // Has default value
  resolutionTarget?: string; // Has default value
  escalationTarget?: string | null;
  assignedDepartment?: string; // Has default value
  operatingHours?: string; // Has default value
  status?: ServiceRuleStatus; // Has default value
}

export type CsServiceWorkflowRuleUpdateAttributes = Partial<CsServiceWorkflowRuleCreationAttributes>;

// Helper type for including relations
export interface CsServiceWorkflowRuleWithRelations extends CsServiceWorkflowRuleAttributes {
  organization?: SysOrganization;
  projectDetails?: Project;
}
