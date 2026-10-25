/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { Building } from '../building/pr_building_model';
import {  UnitPlot } from '../unit_plot/pr_unit_plot_model';

export interface FloorAttributes {
  uuid?: string;
  buildingUuid: string;
  floorCode: string;
  floorName: string;
  floorNumber: number;
  unitsCount: number;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface FloorCreationAttributes extends Omit<FloorAttributes, 'uuid'> {}
export interface FloorUpdateAttributes extends Partial<FloorAttributes> {}

@Table({
  tableName: 'floor',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Floor
  extends BaseModel<FloorUpdateAttributes, FloorCreationAttributes>
  implements FloorAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4, // ✅ Auto-generate UUID
  })
  declare uuid: string;

  @ForeignKey(() => Building)
  @Column({
    type: DataType.UUID, // ✅ Foreign Key (UUID must be)
    allowNull: false,
  })
  declare buildingUuid: string;

  @BelongsTo(() => Building, { foreignKey: 'buildingUuid', targetKey: 'uuid' })
  declare building: Building;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare floorCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare floorName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare floorNumber: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare unitsCount: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedById?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string; 
 @HasMany(() => UnitPlot, { foreignKey: 'floorUuid', sourceKey: 'uuid' })
  declare unitPlots: UnitPlot[];

}