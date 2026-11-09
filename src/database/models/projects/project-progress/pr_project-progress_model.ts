/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

// Types for Attributes
export interface ProjectProgressAttributes {
  uid?: string; 
  uuid?: string;
  projectUuid: string;
  asOfDate: Date;
  physicalPct: number; // e.g., 42.5
  financialPct: number; // e.g., 40.0
  remarks?: string;
  photos?: string[]; // Array of photo URLs
  loggedBy: string; // Name of the user who logged it
  loggedById: string; // UUID of the user
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ProjectProgressCreationAttributes extends Omit<ProjectProgressAttributes, 'uid'> {}
export interface ProjectProgressUpdateAttributes extends Partial<ProjectProgressAttributes> {}

@Table({
  tableName: 'project_progress',
  timestamps: true,
  paranoid: true, // Enables soft delete (required for restore)
  underscored: false,
})
export class ProjectProgress
  extends BaseModel<
    ProjectProgressUpdateAttributes,
    ProjectProgressCreationAttributes
  >
  implements ProjectProgressAttributes
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
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare asOfDate: Date;

  @Column({
    type: DataType.DECIMAL(5, 2), // 100.00 max, 2 decimal places
    allowNull: false,
    defaultValue: 0,
  })
  declare physicalPct: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare financialPct: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare remarks?: string;

  @Column({
    type: DataType.JSONB, // Postgres JSONB for array of URLs
    allowNull: true,
    defaultValue: [],
  })
  declare photos?: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare loggedBy: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare loggedById: string;

  // Audit Fields
  @Column({
          field: 'created_by', type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({
          field: 'updated_by', type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({
          field: 'deleted_by', type: DataType.STRING, allowNull: true })
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