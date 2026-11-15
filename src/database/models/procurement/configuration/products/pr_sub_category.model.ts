import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
/* eslint-disable prettier/prettier */

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  ProcurementSubCategoryAttributes,
  ProcurementSubCategoryCreationAttributes,
  ProcurementSubCategoryUpdateAttributes,
} from 'src/database/types/procurementsubcategory.types';
import { Category } from './pr_category.model';
import { ProcurementItemEntry } from './pr_item_entry.model';

@Table({
  tableName: 'pr_sub_category',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProcurementSubCategory
  extends BaseModel<
    ProcurementSubCategoryUpdateAttributes,
    ProcurementSubCategoryCreationAttributes
  >
  implements ProcurementSubCategoryAttributes
{
  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare categoryId: string;

  @BelongsTo(() => Category, {
    foreignKey: 'categoryId',
    targetKey: 'uuid',
    as: 'category',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare category?: Category;

  @HasMany(() => ProcurementItemEntry, {
    foreignKey: 'sub_category_id',
    sourceKey: 'uuid',
    as: 'itemEntries',
  })
  declare itemEntries?: ProcurementItemEntry[];

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

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
