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
  CsCommitteeMemberAttributes,
  CsCommitteeMemberCreationAttributes,
} from '../../types/cscommitteemember.types';
import type {
  CommitteeDesignation,
  CommitteeMemberStatus,
  CommitteeMemberType,
} from './cs_committee.types';

@Table({
  tableName: 'cs_committee_members',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_comm_mem_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_comm_mem_proj_status',
      fields: ['project_id', 'status'],
    },
  ],
})
export class CsCommitteeMember extends TenantBaseModel<
  CsCommitteeMemberAttributes,
  CsCommitteeMemberCreationAttributes
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
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'FLAT_OWNER',
    field: 'member_type',
  })
  declare memberType: CommitteeMemberType;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'flat_number',
  })
  declare flatNumber?: string | null;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'name',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'Member',
    field: 'designation',
  })
  declare designation: CommitteeDesignation;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    field: 'responsibility',
  })
  declare responsibility?: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'phone',
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'email',
  })
  declare email?: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'term_start',
  })
  declare termStart: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'term_end',
  })
  declare termEnd?: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'ACTIVE',
    field: 'status',
  })
  declare status: CommitteeMemberStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  declare notes?: string | null;
}

