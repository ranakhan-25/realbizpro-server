/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';

// Enums based on UI
export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  UNDER_REVIEW = 'Under Review',
  COMPLETED = 'Completed',
}

// Types for Attributes
export interface ProjectTaskAttributes {
  uid?: string;
  uuid?: string;
  projectUuid: string;
  milestoneUuid?: string;
  taskCode: string;
  title: string;
  assignee: string;
  priority: TaskPriority;
  dueDate: Date;
  reminderBefore?: number;
  description?: string;
  status: TaskStatus;
  attachmentUrl?: string;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ProjectTaskCreationAttributes extends Omit<ProjectTaskAttributes, 'uid'> {}
export interface ProjectTaskUpdateAttributes extends Partial<ProjectTaskAttributes> {}

@Table({
  tableName: 'project_task',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProjectTask
  extends BaseModel<
    ProjectTaskUpdateAttributes,
    ProjectTaskCreationAttributes
  >
  implements ProjectTaskAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectUuid: string;

  @Column({
    type: DataType.UUID,
    allowNull: true, // Optional because the UI shows it's not strictly marked with '*'
  })
  declare milestoneUuid?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare taskCode: string; // e.g., TSK-201

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare assignee: string;

  @Column({
    type: DataType.ENUM(...Object.values(TaskPriority)),
    allowNull: false,
    defaultValue: TaskPriority.MEDIUM,
  })
  declare priority: TaskPriority;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare dueDate: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 30,
  })
  declare reminderBefore?: number; // In minutes

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    defaultValue: TaskStatus.TODO,
  })
  declare status: TaskStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare attachmentUrl?: string;

  // Audit fields (similar to Milestone)
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