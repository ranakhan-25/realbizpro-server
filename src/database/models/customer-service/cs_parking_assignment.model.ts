import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import { CsParkingSlot } from './cs_parking_slot.model';
import type {
  CsParkingAssignmentAttributes,
  CsParkingAssignmentCreationAttributes,
} from '../../types/csparkingassignment.types';
import type { ParkingVehicleType } from './cs_parking.types';

@Table({
  tableName: 'cs_parking_assignments',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_prk_assign_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_prk_assign_slot_active',
      fields: ['slot_id', 'is_active'],
    },
  ],
})
export class CsParkingAssignment extends TenantBaseModel<
  CsParkingAssignmentAttributes,
  CsParkingAssignmentCreationAttributes
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

  @ForeignKey(() => CsParkingSlot)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'slot_id',
  })
  declare slotId: number;

  @BelongsTo(() => CsParkingSlot, {
    foreignKey: 'slotId',
    as: 'slot',
  })
  declare slot?: CsParkingSlot;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'flat_number',
  })
  declare flatNumber: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'resident_name',
  })
  declare residentName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'resident_phone',
  })
  declare residentPhone?: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'vehicle_number',
  })
  declare vehicleNumber: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'Car',
    field: 'vehicle_type',
  })
  declare vehicleType: ParkingVehicleType;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'rfid_tag',
  })
  declare rfidTag?: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'start_date',
  })
  declare startDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'end_date',
  })
  declare endDate?: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  declare isActive: boolean;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'release_date',
  })
  declare releaseDate?: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'release_reason',
  })
  declare releaseReason?: string | null;
}

