/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';

// Enums based on UI
export enum ControlType {
  COST = 'Cost',
  SCHEDULE = 'Schedule',
  QUALITY = 'Quality',
}

export enum ControlStatus {
  OK = 'OK',
  WARNING = 'Warning',
  BREACH = 'Breach',
}

// Types for Attributes
export interface ProjectControlAttributes {
  uid?: string; 
  uuid?: string;
  projectUuid: string;
  controlCode: string; // e.g., CTRL-001
  controlType: ControlType;
  thresholdTarget: number;
  actualValue: number;
  actionStep?: string; // Corrective Action / Note
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ProjectControlCreationAttributes extends Omit<ProjectControlAttributes, 'uid'> {}
export interface ProjectControlUpdateAttributes extends Partial<ProjectControlAttributes> {}

@Table({
  tableName: 'project_control',
  timestamps: true,
  paranoid: true, // Enables soft delete (required for restore)
  underscored: false,
})
export class ProjectControl
  extends BaseModel<
    ProjectControlUpdateAttributes,
    ProjectControlCreationAttributes
  >
  implements ProjectControlAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uid: string;

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
  declare controlCode: string;

  @Column({
    type: DataType.ENUM(...Object.values(ControlType)),
    allowNull: false,
  })
  declare controlType: ControlType;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare thresholdTarget: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare actualValue: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare actionStep?: string;

  // Audit Fields
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