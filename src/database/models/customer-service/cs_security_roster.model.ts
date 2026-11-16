import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import { CsSecurityGuard } from './cs_security_guard.model';
import type {
  CsSecurityRosterAttributes,
  CsSecurityRosterCreationAttributes,
} from '../../types/cssecurityroster.types';
import type { RosterStatus, ShiftName } from './cs_security.types';

@Table({
  tableName: 'cs_security_rosters',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_sec_rosters_org_proj_date',
      fields: ['organization_id', 'project_id', 'duty_date'],
    },
    {
      name: 'idx_cs_sec_rosters_guard_date',
      fields: ['guard_id', 'duty_date'],
    },
  ],
})
export class CsSecurityRoster extends TenantBaseModel<
  CsSecurityRosterAttributes,
  CsSecurityRosterCreationAttributes
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

  @ForeignKey(() => CsSecurityGuard)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'guard_id',
  })
  declare guardId: number;

  @BelongsTo(() => CsSecurityGuard, {
    foreignKey: 'guardId',
    as: 'guard',
  })
  declare guard?: CsSecurityGuard;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'duty_date',
  })
  declare dutyDate: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'shift_name',
  })
  declare shiftName: ShiftName;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    field: 'shift_start',
  })
  declare shiftStart: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    field: 'shift_end',
  })
  declare shiftEnd: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'post_location',
  })
  declare postLocation: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'SCHEDULED',
    field: 'status',
  })
  declare status: RosterStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  declare notes?: string | null;
}

