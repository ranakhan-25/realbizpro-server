/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

// ✅ Floor ইমপোর্ট এবং @ForeignKey/@BelongsTo সম্পূর্ণ বাদ দেওয়া হয়েছে

export enum PlotType {
  ONE_BHK = '1BHK',
  TWO_BHK = '2BHK',
  THREE_BHK = '3BHK',
  OFFICE = 'Office',
  SHOP = 'Shop',
  PLOT = 'Plot',
}

export enum PlotFacing {
  NORTH = 'NORTH (N)',
  SOUTH = 'SOUTH (S)',
  EAST = 'EAST (E)',
  WEST = 'WEST (W)',
  NORTH_EAST = 'NE',
  NORTH_WEST = 'NW',
  SOUTH_EAST = 'SE',
  SOUTH_WEST = 'SW',
}

export enum PlotStatus {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
  SOLD = 'Sold',
  RESERVED = 'Reserved',
  BLOCKED = 'Blocked',
}

export interface UnitPlotAttributes {
  uuid?: string;
  floorUuid: string;
  plotCode: string;
  plotType: PlotType;
  sizeSqft: number;
  facing: PlotFacing;
  basePrice: number;
  floorRise: number;
  premium: number;
  amenities?: string;
  status: PlotStatus;
  notes?: string;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface UnitPlotCreationAttributes extends Omit<UnitPlotAttributes, 'uuid'> {}
export interface UnitPlotUpdateAttributes extends Partial<UnitPlotAttributes> {}

@Table({
  tableName: 'unit_plot',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class UnitPlot
  extends BaseModel<UnitPlotUpdateAttributes, UnitPlotCreationAttributes>
  implements UnitPlotAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  // ✅ শুধু সাধারণ কলাম, কোনো ForeignKey ডেকোরেটর নেই
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare floorUuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare plotCode: string;

  @Column({
    type: DataType.ENUM(...Object.values(PlotType)),
    allowNull: false,
  })
  declare plotType: PlotType;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare sizeSqft: number;

  @Column({
    type: DataType.ENUM(...Object.values(PlotFacing)),
    allowNull: false,
  })
  declare facing: PlotFacing;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare basePrice: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare floorRise: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare premium: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare amenities?: string;

  @Column({
    type: DataType.ENUM(...Object.values(PlotStatus)),
    allowNull: false,
    defaultValue: PlotStatus.AVAILABLE,
  })
  declare status: PlotStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare notes?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedById?: string;

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
    @ForeignKey(() => Project)
    @Column({
            type: DataType.UUID,
            allowNull: true,
            field: 'project_id',
            defaultValue: null,
          })
    declare projectId?: string | null;
    @BelongsTo(() => Project, {
            foreignKey: 'projectId',
            targetKey: 'uuid',
            as: 'project',
          })
    declare project?: Project;
}