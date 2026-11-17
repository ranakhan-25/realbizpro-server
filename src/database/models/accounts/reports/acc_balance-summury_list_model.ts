import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';

export enum RowType {
  SECTION = 'section',
  SUBGROUP = 'subgroup',
  ITEM = 'item',
  TOTAL = 'total',
  GRAND_TOTAL = 'grand-total',
}

export interface BalanceSheetAttributes {
  uuid?: string;
  company: string;
  asOfDate: Date;
  particulars: string;
  balance: number;
  type: RowType;
  indent?: number;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BalanceSheetCreationAttributes extends Omit<BalanceSheetAttributes, 'uuid'> {}
export interface BalanceSheetUpdateAttributes extends Partial<BalanceSheetAttributes> {}

@Table({
  tableName: 'balance_sheet',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class BalanceSheet
  extends BaseModel<BalanceSheetUpdateAttributes, BalanceSheetCreationAttributes>
  implements BalanceSheetAttributes
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
  })
  declare company: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare asOfDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare particulars: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare balance: number;

  @Column({
    type: DataType.ENUM(...Object.values(RowType)),
    allowNull: false,
    defaultValue: RowType.ITEM,
  })
  declare type: RowType;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  declare indent?: number;

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