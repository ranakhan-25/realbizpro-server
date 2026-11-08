import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
/* eslint-disable prettier/prettier */

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Category } from './pr_category.model';
import {
  CategoryAccountMappingAttributes,
  CategoryAccountMappingCreationAttributes,
  CategoryAccountMappingUpdateAttributes,
} from 'src/database/types/categoryaccountmapping.types';

// ENUM মডেল ফাইলের ভেতরে রাখা হলো
export enum AccountCreationType {
  CREATE_NEW = 'Create New',
  EXISTING = 'Existing',
}

@Table({
  tableName: 'pr_category_account_mapping',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class CategoryAccountMapping
  extends BaseModel<
    CategoryAccountMappingUpdateAttributes,
    CategoryAccountMappingCreationAttributes
  >
  implements CategoryAccountMappingAttributes
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
  })
  declare category?: Category;

  // ---------------- Inventory Account Section ----------------

  @Column({
    type: DataType.ENUM(
      ...Object.values(AccountCreationType),
    ),
    allowNull: false,
    defaultValue: AccountCreationType.CREATE_NEW,
  })
  declare inventoryAccountType: AccountCreationType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare inventoryAccountGroupCode?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare existingInventoryAccountId?: string;

  // ---------------- Consumption Account Section ----------------

  @Column({
    type: DataType.ENUM(
      ...Object.values(AccountCreationType),
    ), // ENUM ব্যবহার
    allowNull: false,
    defaultValue: AccountCreationType.CREATE_NEW,
  })
  declare consumptionAccountType: AccountCreationType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare consumptionAccountGroupCode?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare existingConsumptionAccountId?: string;

  // Audit Fields
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

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'deleted_by',
    defaultValue: null,
  })
  declare deletedBy?: string | null;

}
