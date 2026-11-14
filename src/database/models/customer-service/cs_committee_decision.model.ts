import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import type {
  CsCommitteeDecisionAttributes,
  CsCommitteeDecisionCreationAttributes,
} from '../../types/cscommitteedecision.types';
import type { DecisionStatus } from './cs_committee.types';

@Table({
  tableName: 'cs_committee_decisions',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_comm_dec_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_comm_dec_proj_date',
      fields: ['project_id', 'meeting_date'],
    },
  ],
})
export class CsCommitteeDecision extends TenantBaseModel<
  CsCommitteeDecisionAttributes,
  CsCommitteeDecisionCreationAttributes
> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'project_id',
  })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: 'title',
  })
  declare title: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'meeting_date',
  })
  declare meetingDate: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'General Body',
    field: 'agenda_category',
  })
  declare agendaCategory: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'resolution_notes',
  })
  declare resolutionNotes: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'APPROVED',
    field: 'status',
  })
  declare status: DecisionStatus;
}

