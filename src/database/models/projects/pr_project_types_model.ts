import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import type {
  ProjectTypeAttributes,
  ProjectTypeCreationAttributes,
} from 'src/database/types/projecttype.types';

export enum ProjectStatusEnum {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

@Table({
  tableName: 'Project',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Project_code_idx',
      fields: ['code'],
    },
    {
      name: 'Project_status_idx',
      fields: ['status'],
    },
    {
      name: 'Project_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class ProjectType
  extends BaseModel<
    ProjectTypeAttributes,
    ProjectTypeCreationAttributes
  >
  implements ProjectTypeAttributes
{
  // ★★★ BaseModel-এর number id কে override করা হচ্ছে ★★★

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare areaId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectType?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare location?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare startDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare endDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: ProjectStatusEnum.ONGOING,
  })
  // declare status: ProjectStatusEnum | string;
  declare status: ProjectStatusEnum | string;
}