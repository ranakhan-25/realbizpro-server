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
  MaintenanceType,
  MaintenanceStatus,
} from './cs_property_care.types';
import type {
  CsMaintenanceRequestAttributes,
  CsMaintenanceRequestCreationAttributes,
} from '../../types/csmaintenancerequest.types';

export { MaintenanceType, MaintenanceStatus };

@Table({
  tableName: 'cs_maintenance_requests',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_mnt_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_mnt_status',
      fields: ['status'],
    },
    {
      name: 'idx_cs_mnt_type',
      fields: ['maintenance_type'],
    },
    {
      name: 'idx_cs_mnt_req_no',
      fields: ['request_no'],
    },
  ],
})
export class CsMaintenanceRequest extends TenantBaseModel<
  CsMaintenanceRequestAttributes,
  CsMaintenanceRequestCreationAttributes
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
    field: 'request_no',
  })
  declare requestNo: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'facility',
  })
  declare facility: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: MaintenanceType.PREVENTIVE,
    field: 'maintenance_type',
  })
  declare maintenanceType: MaintenanceType;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'scheduled_date',
    defaultValue: DataType.NOW,
  })
  declare scheduledDate: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: 'In-house Facility Care',
    field: 'vendor_name',
  })
  declare vendorName: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'vendor_id',
  })
  declare vendorId?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'cost_estimate',
  })
  declare costEstimate: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    field: 'actual_cost',
  })
  declare actualCost?: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: MaintenanceStatus.SCHEDULED,
    field: 'status',
  })
  declare status: MaintenanceStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'completion_date',
  })
  declare completionDate?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'remarks',
  })
  declare remarks?: string;
}
