import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementHireBill } from './pr_hire_bill.model';
import { ProcurementHireOrderItem } from './pr_hire_order_item.model';
import type { ProcurementHireBillItemAttributes, ProcurementHireBillItemCreationAttributes } from '../../../types/procurementhirebillitem.types';

@Table({
  tableName: 'pr_hire_bill_items',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProcurementHireBillItem extends BaseModel<ProcurementHireBillItemAttributes, ProcurementHireBillItemCreationAttributes> {
  @ForeignKey(() => ProcurementHireBill)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare bill_id: string;
  @BelongsTo(() => ProcurementHireBill, {
    foreignKey: 'bill_id',
    targetKey: 'uuid',
    as: 'bill',
    onDelete: 'CASCADE',
  })
  declare bill?: ProcurementHireBill;
  @ForeignKey(() => ProcurementHireOrderItem)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare hire_order_item_id: string;
  @BelongsTo(() => ProcurementHireOrderItem, {
    foreignKey: 'hire_order_item_id',
    targetKey: 'uuid',
    as: 'hireOrderItem',
  })
  declare hireOrderItem?: ProcurementHireOrderItem;
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare description: string;
  @Column({
    type: DataType.DECIMAL(15, 3),
    allowNull: false,
  })
  declare quantity: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  declare rate: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare tax_amount: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare vat_amount: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  declare amount: number;


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
    field: 'created_by',
    defaultValue: null,
  })
  declare createdBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'updated_by',
    defaultValue: null,
  })
  declare updatedBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'deleted_by',
    defaultValue: null,
  })
  declare deletedBy?: string | null;

}
