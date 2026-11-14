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
  CsParkingExternalRentalAttributes,
  CsParkingExternalRentalCreationAttributes,
} from '../../types/csparkingexternalrental.types';
import type {
  ExternalRentalStatus,
  ParkingVehicleType,
  RentalPaymentStatus,
} from './cs_parking.types';

@Table({
  tableName: 'cs_parking_external_rentals',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_prk_ext_rent_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_prk_ext_rent_slot_status',
      fields: ['slot_id', 'status'],
    },
    {
      name: 'idx_cs_prk_ext_rent_pay_status',
      fields: ['project_id', 'payment_status'],
    },
  ],
})
export class CsParkingExternalRental extends TenantBaseModel<
  CsParkingExternalRentalAttributes,
  CsParkingExternalRentalCreationAttributes
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
    type: DataType.STRING(150),
    allowNull: false,
    field: 'renter_name',
  })
  declare renterName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'renter_phone',
  })
  declare renterPhone: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'renter_nid',
  })
  declare renterNid?: string | null;

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
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'monthly_rent',
  })
  declare monthlyRent: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'deposit_amount',
  })
  declare depositAmount: number;

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
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'DUE',
    field: 'payment_status',
  })
  declare paymentStatus: RentalPaymentStatus;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'amount_collected',
  })
  declare amountCollected: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'last_payment_date',
  })
  declare lastPaymentDate?: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'ACTIVE',
    field: 'status',
  })
  declare status: ExternalRentalStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  declare notes?: string | null;
}

