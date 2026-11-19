/* eslint-disable prettier/prettier */
import type { FlatLandOfferAttributes, FlatLandOfferCreationAttributes } from '../../../types/flatlandoffer.types';

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
  tableName: 'pr_flat_land_offers',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    { name: 'pr_flat_land_offer_project_id_idx', fields: ['project_id'] },
    { name: 'pr_flat_land_offer_flat_land_id_idx', fields: ['flatLandId'] },
  ],
})
export class FlatLandOffer extends BaseModel<FlatLandOfferAttributes, FlatLandOfferCreationAttributes> {
  @ForeignKey(() => Project)
  @Column({
              field: 'project_id', type: DataType.UUID, allowNull: false })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @ForeignKey(() => FlatLand)
  @Column({ type: DataType.UUID, allowNull: true })
  declare flatLandId?: string;

  @BelongsTo(() => FlatLand, {
    foreignKey: 'flatLandId',
    targetKey: 'uuid',
    as: 'flatLand',
  })
  declare flatLand?: FlatLand;

  @Column({ type: DataType.STRING(80), allowNull: false, unique: true })
  declare code: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare offerDate: Date;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare customerName?: string;

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

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare approvalStatus?: string;

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
