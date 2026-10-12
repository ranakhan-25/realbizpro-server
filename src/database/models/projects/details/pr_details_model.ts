/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { DetailsAttributes, DetailsCreationAttributes, DetailsUpdateAttributes } from 'src/database/types/details.types';

// // Apnar project folder structure onujayi base.model er path thik kore deben (jemon relative path: '../../../base.model' ba 'src/base.model')
// import { BaseModel } from '../../../base.model';

// // Apnar details.types.ts file-ti jekhane ache oitar thik path diye deben
// import {
//   DetailsAttributes,
//   DetailsCreationAttributes,
//   DetailsUpdateAttributes,
// } from '../types/details.types'; // Path check kore deben

@Table({
  tableName: 'pr_details',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Details
  extends BaseModel<
    DetailsUpdateAttributes,
    DetailsCreationAttributes
  >
  implements DetailsAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare areaOfLand?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare nameOfLandOwner?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare landOwnerDeveloperRatio?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare valueOfLand?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare buildArea?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare totalNoOfBuilding?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare totalFloorOfBuilding?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare noOfFlatInEachFloor?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare totalFlatInTheBuilding?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare flatSize?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare totalNoOfCarParking?: string;

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