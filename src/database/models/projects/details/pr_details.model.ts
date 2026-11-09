/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { DetailsAttributes, DetailsCreationAttributes, DetailsUpdateAttributes } from 'src/database/types/details.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

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
          field: 'created_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare createdBy?: string;

  @Column({
          field: 'updated_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare updatedBy?: string;

  @Column({
          field: 'deleted_by',
          type: DataType.STRING,
          allowNull: true,
        })
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