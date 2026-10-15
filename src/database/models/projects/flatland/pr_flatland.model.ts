/* eslint-disable prettier/prettier */

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from '../project/pr_project.model';
import { FlatLandBooking } from '../flat-land-booking/pr_flat_land_booking.model';
import { FlatLandOffer } from '../flat-land-offer/pr_flat_land_offer.model';
import {
  FlatLandAttributes,
  FlatLandCreationAttributes,
  FlatLandUpdateAttributes,
} from 'src/database/types/flatland.types';

export enum FlatLandStatus {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
  SOLD = 'Sold',
}

@Table({
  tableName: 'pr_flat_land',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class FlatLand
  extends BaseModel<
    FlatLandUpdateAttributes,
    FlatLandCreationAttributes
  >
  implements FlatLandAttributes
{
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare projectId?: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @HasMany(() => FlatLandBooking, {
    foreignKey: 'flatLandId',
    sourceKey: 'uuid',
    as: 'bookings',
  })
  declare bookings?: FlatLandBooking[];

  @HasMany(() => FlatLandOffer, {
    foreignKey: 'flatLandId',
    sourceKey: 'uuid',
    as: 'offers',
  })
  declare offers?: FlatLandOffer[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare projectName: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'flat',
  })
  declare propertyType: 'flat' | 'land';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare siteBlock?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare siteName?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare blockName?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare roadNo?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare roadSize?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare plotLocation?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare flatLandNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare unit?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare bedroom?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare bathroom?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare size?: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare pricePerUnit?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare parkingCost?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare utilityCharge?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare customerName?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare facing?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare amenities?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare drawing?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare dining?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare kitchen?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare balcony?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare parking?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare basement?: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare subtotal?: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare grandTotal?: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(FlatLandStatus).map((v) => String(v)),
    ),
    allowNull: false,
    defaultValue: FlatLandStatus.AVAILABLE,
  })
  declare status: FlatLandStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;
}