import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Lead } from './crm-lead.model';

import type { LeadPropertyInterestAttributes, LeadPropertyInterestCreationAttributes } from '../../../types/leadpropertyinterest.types';

@Table({ tableName: 'crm_lead_property_interests', timestamps: true, paranoid: true, underscored: true })
export class LeadPropertyInterest extends BaseModel<LeadPropertyInterestAttributes, LeadPropertyInterestCreationAttributes> {
  @ForeignKey(() => Lead)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'lead_id' }) declare leadId: number;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'project_name' }) declare projectName?: string;
  @ForeignKey(() => Project)
  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' }) declare projectId?: string;
  @Column({ type: DataType.STRING(150), allowNull: true, field: 'plot_flat_no' }) declare plotFlatNo?: string;
  @Column({ type: DataType.STRING(100), allowNull: true }) declare size?: string;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, field: 'quoted_price' }) declare quotedPrice?: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, field: 'client_offered_price' }) declare clientOfferedPrice?: number;
  @Column({ type: DataType.STRING(50), allowNull: true }) declare status?: string;
  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'org_id',
    defaultValue: null,
  })
  declare orgId?: number | null;

  @BelongsTo(() => SysOrganization, {
    foreignKey: 'orgId',
    targetKey: 'id',
    as: 'organization',
  })
  declare organization?: SysOrganization;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by', defaultValue: null }) declare createdBy?: string | null;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by', defaultValue: null }) declare updatedBy?: string | null;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by', defaultValue: null }) declare deletedBy?: string | null;
  @BelongsTo(() => Lead, { foreignKey: 'leadId', targetKey: 'id', as: 'lead' }) declare lead?: Lead;
  @BelongsTo(() => Project, { foreignKey: 'projectId', targetKey: 'uuid', as: 'project' }) declare project?: Project;
}
