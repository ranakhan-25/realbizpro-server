/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';

import {
  TaskAttributes,
  TaskCreationAttributes,
  TaskUpdateAttributes,
} from 'src/database/types/task.types';

export enum TaskStatus {
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  DELAYED = 'Delayed',
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

@Table({
  tableName: 'task',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Task
  extends BaseModel<
    TaskUpdateAttributes,
    TaskCreationAttributes
  >
  implements TaskAttributes
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
  declare taskName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare progress: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(TaskPriority),
    ),
    allowNull: false,
    defaultValue: TaskPriority.MEDIUM,
  })
  declare priority: TaskPriority;

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
  declare duration?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(TaskStatus),
    ),
    allowNull: false,
    defaultValue: TaskStatus.IN_PROGRESS,
  })
  declare status: TaskStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare completeDate?: Date;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare budget?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare cost?: number;

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