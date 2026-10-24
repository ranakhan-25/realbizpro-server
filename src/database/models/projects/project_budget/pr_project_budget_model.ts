/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';

// Enums based on UI
export enum BudgetStatus {
  ON_TRACK = 'On Track',
  WARNING = 'Warning',
  EXCEEDED = 'Exceeded',
}

export enum BudgetCategoryType {
  MATERIAL = 'Material',
  LABOUR = 'Labour',
  EQUIPMENT = 'Equipment',
  OVERHEAD = 'Overhead',
  SUBCONTRACTOR = 'Subcontractor',
}

// Types for Attributes
export interface ProjectBudgetAttributes {
  uid?: string; // UUID handled by BaseModel or generated
  uuid?: string;
  projectUuid: string;
  budgetCode: string; // e.g., BGT-001
  category: BudgetCategoryType;
  plannedAmount: number;
  revisedAmount?: number;
  status: BudgetStatus;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ProjectBudgetCreationAttributes extends Omit<ProjectBudgetAttributes, 'uid'> {}
export interface ProjectBudgetUpdateAttributes extends Partial<ProjectBudgetAttributes> {}

@Table({
  tableName: 'project_budget',
  timestamps: true,
  paranoid: true, // Enables soft delete (required for restore)
  underscored: false,
})
export class ProjectBudget
  extends BaseModel<
    ProjectBudgetUpdateAttributes,
    ProjectBudgetCreationAttributes
  >
  implements ProjectBudgetAttributes
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
  declare budgetCode: string;

  @Column({
    type: DataType.ENUM(...Object.values(BudgetCategoryType)),
    allowNull: false,
  })
  declare category: BudgetCategoryType;

  @Column({
    type: DataType.DECIMAL(15, 2), // Handles large currency amounts like 3,250,000.00
    allowNull: false,
    defaultValue: 0,
  })
  declare plannedAmount: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  declare revisedAmount?: number;

  @Column({
    type: DataType.ENUM(...Object.values(BudgetStatus)),
    allowNull: false,
    defaultValue: BudgetStatus.ON_TRACK,
  })
  declare status: BudgetStatus;

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