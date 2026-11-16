import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import {
  ServiceRuleType,
  ServiceRuleStatus,
} from './cs_rules.types';
import type {
  CsServiceWorkflowRuleAttributes,
  CsServiceWorkflowRuleCreationAttributes,
} from '../../types/csserviceworkflowrule.types';

export { ServiceRuleType, ServiceRuleStatus };

@Table({
  tableName: 'cs_service_workflow_rules',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_rules_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_rules_type',
      fields: ['rule_type'],
    },
    {
      name: 'idx_cs_rules_status',
      fields: ['status'],
    },
    {
      name: 'idx_cs_rules_code',
      fields: ['rule_code'],
    },
  ],
})
export class CsServiceWorkflowRule extends TenantBaseModel<
  CsServiceWorkflowRuleAttributes,
  CsServiceWorkflowRuleCreationAttributes
> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
  })
  declare projectId?: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'projectDetails',
  })
  declare projectDetails?: Project;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'project_name',
  })
  declare projectName?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'rule_code',
  })
  declare ruleCode: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'rule_name',
  })
  declare ruleName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: ServiceRuleType.SLA_POLICY,
    field: 'rule_type',
  })
  declare ruleType: ServiceRuleType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'category_or_trigger',
  })
  declare categoryOrTrigger: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: '2 Hours',
    field: 'first_response_target',
  })
  declare firstResponseTarget: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: '24 Hours',
    field: 'resolution_target',
  })
  declare resolutionTarget: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'escalation_target',
  })
  declare escalationTarget?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: 'Site Engineering & QA',
    field: 'assigned_department',
  })
  declare assignedDepartment: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'Office Hours (Sat-Thu 9am-6pm)',
    field: 'operating_hours',
  })
  declare operatingHours: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: ServiceRuleStatus.ACTIVE,
    field: 'status',
  })
  declare status: ServiceRuleStatus;
}
