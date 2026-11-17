import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementHireOut } from './pr_hire_out.model';
import { ProcurementHireOrderItem } from './pr_hire_order_item.model';
import type { ProcurementHireOutItemAttributes, ProcurementHireOutItemCreationAttributes } from '../../../types/procurementhireoutitem.types';

@Table({ tableName: 'pr_hire_out_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementHireOutItem extends BaseModel<ProcurementHireOutItemAttributes, ProcurementHireOutItemCreationAttributes> {
  @ForeignKey(() => ProcurementHireOut) @Column({ type: DataType.UUID, allowNull: false }) declare hire_out_id: string;
  @BelongsTo(() => ProcurementHireOut, { foreignKey: 'hire_out_id', targetKey: 'uuid', as: 'hireOut', onDelete: 'CASCADE' }) declare hireOut?: ProcurementHireOut;
  @ForeignKey(() => ProcurementHireOrderItem) @Column({ type: DataType.UUID, allowNull: false }) declare hire_order_item_id: string;
  @BelongsTo(() => ProcurementHireOrderItem, { foreignKey: 'hire_order_item_id', targetKey: 'uuid', as: 'hireOrderItem' }) declare hireOrderItem?: ProcurementHireOrderItem;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false }) declare quantity: number;
  @Column({ type: DataType.STRING(40), allowNull: false, defaultValue: 'good' }) declare condition: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare remarks?: string;


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
