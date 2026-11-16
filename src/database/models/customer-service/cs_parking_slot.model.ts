import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import type {
  CsParkingSlotAttributes,
  CsParkingSlotCreationAttributes,
} from '../../types/csparkingslot.types';
import type {
  ParkingSlotStatus,
  ParkingVehicleType,
} from './cs_parking.types';
import { CsParkingAssignment } from './cs_parking_assignment.model';
import { CsParkingExternalRental } from './cs_parking_external_rental.model';

@Table({
  tableName: 'cs_parking_slots',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_prk_slots_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_prk_slots_proj_slot',
      fields: ['project_id', 'slot_number'],
      unique: true,
      where: {
        deleted_at: null,
      },
    },
    {
      name: 'idx_cs_prk_slots_proj_status',
      fields: ['project_id', 'status'],
    },
  ],
})
export class CsParkingSlot extends TenantBaseModel<
  CsParkingSlotAttributes,
  CsParkingSlotCreationAttributes
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
    field: 'slot_number',
  })
  declare slotNumber: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'Ground Floor',
    field: 'floor_zone',
  })
  declare floorZone: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'Car',
    field: 'allowed_vehicle_type',
  })
  declare allowedVehicleType: ParkingVehicleType;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'FREE',
    field: 'status',
  })
  declare status: ParkingSlotStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  declare notes?: string | null;

  @HasMany(() => CsParkingAssignment, {
    foreignKey: 'slotId',
    as: 'assignments',
  })
  declare assignments?: CsParkingAssignment[];

  @HasMany(() => CsParkingExternalRental, {
    foreignKey: 'slotId',
    as: 'rentals',
  })
  declare rentals?: CsParkingExternalRental[];
}

