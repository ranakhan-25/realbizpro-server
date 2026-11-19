import type { FlatLandBookingAttributes, FlatLandBookingCreationAttributes } from '../../../types/flatlandbooking.types';

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { FlatLand } from '../flatland/pr_flatland.model';
import { Project } from '../project/pr_project.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

@Table({
  tableName: 'pr_flat_land_bookings',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    { name: 'pr_flat_land_booking_project_id_idx', fields: ['project_id'] },
    { name: 'pr_flat_land_booking_flat_land_id_idx', fields: ['flatLandId'] },
  ],
})
export class FlatLandBooking extends BaseModel<FlatLandBookingAttributes, FlatLandBookingCreationAttributes> {
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false, field: 'project_id' })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @ForeignKey(() => FlatLand)
  @Column({ type: DataType.UUID, allowNull: false })
  declare flatLandId: string;

  @BelongsTo(() => FlatLand, {
    foreignKey: 'flatLandId',
    targetKey: 'uuid',
    as: 'flatLand',
  })
  declare flatLand?: FlatLand;

  @Column({ type: DataType.STRING(80), allowNull: false, unique: true })
  declare code: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare bookingDate: Date;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare customerName: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare salesBy?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare rate: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare otherCost: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare parking: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare utilityCharge: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare discount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare grandTotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare paid: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare due: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare attachment?: string;

  @Column({ type: DataType.STRING(100), allowNull: false, defaultValue: 'Pending' })
  declare status: string;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  declare details: Record<string, unknown>;

  @Column({
          field: 'created_by', type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({
          field: 'updated_by', type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({
          field: 'deleted_by', type: DataType.STRING, allowNull: true })
  declare deletedBy?: string;
    @ForeignKey(() => SysOrganization)
    @Column({
            type: DataType.BIGINT,
            allowNull: true,
            field: 'org_id',
            defaultValue: null,
          })
    declare orgId?: number | null;
    @BelongsTo(() => SysOrganization, {
            foreignKey: 'orgId',
            targetKey: 'id',
            as: 'organization',
          })
    declare organization?: SysOrganization;
}
