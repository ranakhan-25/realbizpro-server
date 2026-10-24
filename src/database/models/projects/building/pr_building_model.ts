/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';

import {
  BuildingAttributes,
  BuildingCreationAttributes,
  BuildingUpdateAttributes,
} from 'src/database/types/building.types';

@Table({
  tableName: 'building',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Building
  extends BaseModel<
    BuildingAttributes,
    BuildingCreationAttributes
  >
  implements BuildingAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare buildingCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare buildingName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare floorsCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare unitsCount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare siteUid: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedBy?: string;

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