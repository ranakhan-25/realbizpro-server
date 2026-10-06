import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import type { ProjectAttributes, ProjectCreationAttributes } from 'src/database/types/project.types';

export enum ProjectStatusEnum {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Table({
  tableName: 'projects',
  timestamps: true,
  paranoid: true,
  underscored: false,
  // indexes সরিয়ে দেয়া হয়েছে আপাতত
})
export class Project
  extends BaseModel<ProjectAttributes, ProjectCreationAttributes >
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
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  declare totalBudget?: number;

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
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare numberOfStoreys?: number;

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
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: ProjectStatusEnum.ACTIVE,
  })
  declare status: ProjectStatusEnum | string;
}