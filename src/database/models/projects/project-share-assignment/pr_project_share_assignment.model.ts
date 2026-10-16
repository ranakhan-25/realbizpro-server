/* eslint-disable prettier/prettier */
import type {
  ProjectShareAssignmentAttributes,
  ProjectShareAssignmentCreationAttributes,
} from 'src/database/types/projectshareassignment.types';

import {
  BeforeValidate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from '../project/pr_project.model';
import { ProjectType } from '../project-type/pr_project_type.model';
import { Site } from '../project-site/pr_project_site.model';

@Table({
  tableName: 'pr_project_share_assignments',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'pr_share_assignment_project_id_idx',
      fields: ['projectId'],
    },
    {
      name: 'pr_share_assignment_project_type_id_idx',
      fields: ['projectTypeId'],
    },
    {
      name: 'pr_share_assignment_site_id_idx',
      fields: ['siteId'],
    },
    {
      name: 'pr_share_assignment_share_code_uq',
      fields: ['shareCode'],
      unique: true,
    },
  ],
})
export class ProjectShareAssignment extends BaseModel<
  ProjectShareAssignmentAttributes,
  ProjectShareAssignmentCreationAttributes
> {
  // ─────────────── Project Relation ───────────────
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  // ─────────────── ProjectType Relation ───────────────
  @ForeignKey(() => ProjectType)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare projectTypeId?: string;

  @BelongsTo(() => ProjectType, {
    foreignKey: 'projectTypeId',
    targetKey: 'uuid',
    as: 'projectType',
  })
  declare projectType?: ProjectType;

  // ─────────────── Site Relation ───────────────
  @ForeignKey(() => Site)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare siteId?: string;

  @BelongsTo(() => Site, {
    foreignKey: 'siteId',
    targetKey: 'uuid',
    as: 'site',
  })
  declare site?: Site;

  // ─────────────── Share Code (Auto Generate) ───────────────
  @Column({
    type: DataType.STRING(80),
    allowNull: false,
    unique: true,
  })
  declare shareCode: string;

  @BeforeValidate
  static generateShareCode(
    instance: ProjectShareAssignment,
  ) {
    if (!instance.shareCode) {
      const random = Math.floor(
        100000 + Math.random() * 900000,
      );
      instance.shareCode = `SHR-${random}`;
    }
  }

  // ─────────────── Customer & Share Info ───────────────
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare customerName: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare noOfShares: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare flatLand?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare note?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare email?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare mobile?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare nid?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare image?: string;

  // ─────────────── Financial Fields ───────────────
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare shareAmount: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare paidAmount: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare totalCost: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare balance: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare due: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare penaltyAmount: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare points: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare assignedAt?: Date;

  @Column({
    type: DataType.ENUM(
      'active',
      'inactive',
      'pending',
    ),
    allowNull: false,
    defaultValue: 'active',
  })
  declare status:
    'active' | 'inactive' | 'pending';

  // ─────────────── Audit ───────────────
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
