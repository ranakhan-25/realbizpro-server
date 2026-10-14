import {
  Column,
  DataType,
  Table,
  HasMany,
  Index,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { LandOwner } from './land-owner.model';

import type {
  AcquisitionLeadAttributes,
  AcquisitionLeadCreationAttributes,
} from '../../types/acquisitionlead.types';

@Table({
  tableName: 'lams_acquisition_leads',
  timestamps: true,
  paranoid: true,
})
export class AcquisitionLead extends BaseModel<
  AcquisitionLeadAttributes,
  AcquisitionLeadCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  declare id: any;

  @Index({ name: 'idx_lead_title' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lead_title: string;

  @Index({ name: 'idx_lead_date' })
  @Column({ type: DataType.DATEONLY })
  lead_date: Date;

  @Index({ name: 'idx_land_type' })
  @Column({ type: DataType.STRING })
  land_type: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  land_area: number;

  @Index({ name: 'idx_lead_status' })
  @Column({
    type: DataType.STRING,
    defaultValue: 'New',
  })
  lead_status: string;

  @Index({ name: 'idx_created_by' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  created_by?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  added_by?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  deleted_by?: number;

  @HasMany(() => LandOwner)
  land_owners: LandOwner[];
}
