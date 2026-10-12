import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';

import {
  ProjectAttributes,
  ProjectCreationAttributes,
  ProjectUpdateAttributes,
} from 'src/database/types/project.types';

import { ShareConfiguration } from '../investor/configuration_model';
import { BaseModel } from 'src/database/base.model';
import { Site } from './pr_site.model';

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

@Table({
  tableName: 'project',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Project
  extends BaseModel<
    ProjectUpdateAttributes,
    ProjectCreationAttributes
  >
  implements ProjectAttributes
{
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
  declare areaCategory?: string;

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
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare startDate?: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare endDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare contactPersonName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare contactPhone?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare clientEmail?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare contractorCompany?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectManager?: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  declare totalBudget?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare numberOfStoreys?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  })
  declare progressPercentage?: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ProjectStatus),
    ),
    allowNull: false,
    defaultValue: ProjectStatus.ACTIVE,
  })
  declare status: ProjectStatus;

  @HasMany(() => Site, {
    foreignKey: 'projectId',
    sourceKey: 'id',
  })
  declare sites?: Site[];

  @HasMany(() => ShareConfiguration, {
    foreignKey: 'projectId',
    sourceKey: 'uuid',
  })
  declare shareConfigurations?: ShareConfiguration[];

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