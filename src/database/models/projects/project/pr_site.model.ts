import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import type {
  SiteAttributes,
  SiteCreationAttributes,
} from 'src/database/types/site.types';
import { Project } from './pr_project_model';

@Table({
  tableName: 'sites',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Site
  extends BaseModel<
    SiteAttributes,
    SiteCreationAttributes
  >
  implements SiteAttributes
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
  declare location?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectType?: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare projectId: number;

  @BelongsTo(() => Project)
  declare project?: Project;

  // ─── Audit fields ───────────────────────────────────────
  @Column({
    type: DataType.INTEGER, // change to STRING / UUID if needed
    allowNull: true,
  })
  declare createdBy?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare updatedBy?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare deletedBy?: number;
}
