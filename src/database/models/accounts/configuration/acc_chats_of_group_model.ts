import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  HasMany,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ChartOfAccount } from './acc_chats_of_accounts_model';


export interface ChartOfGroupAttributes {
  uuid?: string;
  code: string;
  name: string;
  reportSection?: string;
  under: string;
  chartOfSection: string;
  hasDelete?: boolean;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ChartOfGroupCreationAttributes extends Omit<ChartOfGroupAttributes, 'uuid'> {}
export interface ChartOfGroupUpdateAttributes extends Partial<ChartOfGroupAttributes> {}

@Table({
  tableName: 'chart_of_group',
  timestamps: true,
  paranoid: true,
  underscored: true, // ✅ ডাটাবেসে snake_case আছে, তাই এটি true রাখুন
})
export class ChartOfGroup
  extends BaseModel<ChartOfGroupUpdateAttributes, ChartOfGroupCreationAttributes>
  implements ChartOfGroupAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

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
    field: 'report_section', // ✅ ডাটাবেস কলামের নাম
  })
  declare reportSection?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare under: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'chart_of_section', // ✅ ডাটাবেস কলামের নাম
  })
  declare chartOfSection: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    field: 'has_delete', // ✅ ডাটাবেস কলামের নাম
  })
  declare hasDelete?: boolean;

  @HasMany(() => ChartOfAccount)
  declare accounts: ChartOfAccount[];

  @Column({ type: DataType.STRING, allowNull: true, field: 'added_by' })
  declare addedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'added_by_id' })
  declare addedById?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
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