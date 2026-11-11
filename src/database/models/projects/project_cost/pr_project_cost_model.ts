/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

// Enums based on UI
export enum CostHeadType {
  MATERIAL = 'Material',
  LABOUR = 'Labour',
  EQUIPMENT = 'Equipment',
  CONSULTANT = 'Consultant',
  OVERHEAD = 'Overhead',
}

export enum CostRefType {
  BILL = 'BILL',
  JOURNAL = 'JOURNAL',
  PO = 'PO',
  MANUAL = 'MANUAL',
}

// Types for Attributes
export interface ProjectCostAttributes {
  uid?: string; // UUID handled by BaseModel or generated
  uuid?: string;
  projectUuid: string;
  costCode: string; // e.g., CST-101
  costHead: CostHeadType;
  amount: number;
  incurredAt: Date;
  refType: CostRefType;
  refUuid?: string; // Conditional reference (e.g., Bill UUID)
  refNo?: string; // Voucher No / Ref No
  description?: string;
  attachmentUrl?: string;
  approvedBy?: string; // Name of the approver (from UI)
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ProjectCostCreationAttributes extends Omit<ProjectCostAttributes, 'uid'> {}
export interface ProjectCostUpdateAttributes extends Partial<ProjectCostAttributes> {}

@Table({
  tableName: 'project_cost',
  timestamps: true,
  paranoid: true, // Enables soft delete (required for restore)
  underscored: false,
})
export class ProjectCost
  extends BaseModel<
    ProjectCostUpdateAttributes,
    ProjectCostCreationAttributes
  >
  implements ProjectCostAttributes
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
  declare costCode: string;

  @Column({
    type: DataType.ENUM(...Object.values(CostHeadType)),
    allowNull: false,
  })
  declare costHead: CostHeadType;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare amount: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare incurredAt: Date;

  @Column({
    type: DataType.ENUM(...Object.values(CostRefType)),
    allowNull: false,
  })
  declare refType: CostRefType;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare refUuid?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare refNo?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare attachmentUrl?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare approvedBy?: string;

  // Audit Fields
  @Column({ type: DataType.STRING, allowNull: true })
  declare addedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedById?: string;

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