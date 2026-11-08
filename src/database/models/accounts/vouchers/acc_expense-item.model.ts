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
import { Expense } from './acc_expence_list_model';


export interface ExpenseItemAttributes {
  uuid?: string;
  expenseUuid: string;
  accountId: string;
  amount: number;
  note?: string;
}

export interface ExpenseItemCreationAttributes extends Omit<ExpenseItemAttributes, 'uuid'> {}
export interface ExpenseItemUpdateAttributes extends Partial<ExpenseItemAttributes> {}

@Table({
  tableName: 'expense_item',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ExpenseItem
  extends BaseModel<ExpenseItemUpdateAttributes, ExpenseItemCreationAttributes>
  implements ExpenseItemAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @ForeignKey(() => Expense)
  @Column({ type: DataType.UUID, allowNull: false, field: 'expense_uuid' })
  declare expenseUuid: string;

  @BelongsTo(() => Expense, { foreignKey: 'expenseUuid', targetKey: 'uuid' })
  declare expense?: Expense;

  @Column({ type: DataType.STRING, allowNull: false, field: 'account_id' })
  declare accountId: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare amount: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare note?: string;

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