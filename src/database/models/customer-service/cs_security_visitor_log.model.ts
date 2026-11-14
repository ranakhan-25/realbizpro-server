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
  CsSecurityVisitorLogAttributes,
  CsSecurityVisitorLogCreationAttributes,
} from '../../types/cssecurityvisitorlog.types';
import type { VisitorPurpose, VisitorStatus } from './cs_security.types';

@Table({
  tableName: 'cs_security_visitor_logs',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_sec_visitors_org_proj_status',
      fields: ['organization_id', 'project_id', 'status'],
    },
    {
      name: 'idx_cs_sec_visitors_in_time',
      fields: ['in_time'],
    },
  ],
})
export class CsSecurityVisitorLog extends TenantBaseModel<
  CsSecurityVisitorLogAttributes,
  CsSecurityVisitorLogCreationAttributes
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
    type: DataType.STRING(150),
    allowNull: false,
    field: 'visitor_name',
  })
  declare visitorName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'phone',
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'flat_visited',
  })
  declare flatVisited: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'purpose',
  })
  declare purpose: VisitorPurpose;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'in_time',
  })
  declare inTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'out_time',
  })
  declare outTime?: Date | null;

  @ForeignKey(() => CsSecurityGuard)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'guard_on_duty_id',
  })
  declare guardOnDutyId?: number | null;

  @BelongsTo(() => CsSecurityGuard, {
    foreignKey: 'guardOnDutyId',
    as: 'guardOnDuty',
  })
  declare guardOnDuty?: CsSecurityGuard;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'vehicle_number',
  })
  declare vehicleNumber?: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'national_id_or_badge',
  })
  declare nationalIdOrBadge?: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'CHECKED_IN',
    field: 'status',
  })
  declare status: VisitorStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'remarks',
  })
  declare remarks?: string | null;
}

