/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';

import {
  BuildingAttributes,
  BuildingCreationAttributes,
  BuildingUpdateAttributes,
} from 'src/database/types/building.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

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