/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model'; // আপনার BaseModel এর সঠিক পাথ দিন

export enum MilestoneStatus {
  PLANNED = 'Planned',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  DELAYED = 'Delayed',
  CANCELLED = 'Cancelled',
}

export interface ProjectMilestoneAttributes {
  uuid?: string;
  projectUuid: string;
  milestoneCode: string;
  milestoneName: string;
  plannedDate: Date;
  actualDate?: Date;
  progress: number;
  status: MilestoneStatus;
  varianceDays?: string;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ProjectMilestoneCreationAttributes extends Omit<ProjectMilestoneAttributes, 'uuid'> {}
export interface ProjectMilestoneUpdateAttributes extends Partial<ProjectMilestoneAttributes> {}

@Table({
  tableName: 'project_milestone',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProjectMilestone
  extends BaseModel<ProjectMilestoneUpdateAttributes, ProjectMilestoneCreationAttributes>
  implements ProjectMilestoneAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectUuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare milestoneCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare milestoneName: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare plannedDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare actualDate?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare progress: number;

  @Column({
    type: DataType.ENUM(...Object.values(MilestoneStatus)),
    allowNull: false,
    defaultValue: MilestoneStatus.PLANNED,
  })
  declare status: MilestoneStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare varianceDays?: string;

  // ❌ notes ফিল্ডটি বাদ দেওয়া হয়েছে (কারণ ডাটাবেসে কলামটি নেই)

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
}