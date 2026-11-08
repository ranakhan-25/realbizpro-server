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

export enum ReconciliationStatus {
  PENDING = 'Pending',
  HONOUR = 'Honour',
  DISHONOUR = 'DisHonour',
  HOLD = 'Hold',
}

export interface BankReconciliationAttributes {
  uuid?: string;
  voucherNo: string;
  description: string;
  bank: string;
  date: Date;
  chequeDate?: Date;
  amount: number;
  note?: string;
  status: ReconciliationStatus;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BankReconciliationCreationAttributes extends Omit<BankReconciliationAttributes, 'uuid'> {}
export interface BankReconciliationUpdateAttributes extends Partial<BankReconciliationAttributes> {}

@Table({
  tableName: 'bank_reconciliation',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class BankReconciliation
  extends BaseModel<BankReconciliationUpdateAttributes, BankReconciliationCreationAttributes>
  implements BankReconciliationAttributes
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
    field: 'voucher_no',
  })
  declare voucherNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare bank: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'cheque_date',
  })
  declare chequeDate?: Date;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare amount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare note?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReconciliationStatus)),
    allowNull: false,
    defaultValue: ReconciliationStatus.PENDING,
  })
  declare status: ReconciliationStatus;

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