import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementHireOrder } from './pr_hire_order.model';
import { SysUser } from '../../system/sys_user.model';
import { ProcurementHireOutItem } from './pr_hire_out_item.model';
import type { ProcurementHireOutAttributes, ProcurementHireOutCreationAttributes } from '../../../types/procurementhireout.types';

@Table({ tableName: 'pr_hire_out', timestamps: true, paranoid: true, underscored: true })
export class ProcurementHireOut extends BaseModel<ProcurementHireOutAttributes, ProcurementHireOutCreationAttributes> {
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true }) declare hire_out_no: string;
  @ForeignKey(() => ProcurementHireOrder) @Column({ type: DataType.UUID, allowNull: false }) declare hire_order_id: string;
  @BelongsTo(() => ProcurementHireOrder, { foreignKey: 'hire_order_id', targetKey: 'uuid', as: 'hireOrder' }) declare hireOrder?: ProcurementHireOrder;
  @Column({ type: DataType.DATEONLY, allowNull: false }) declare return_date: string;
  @Column({ type: DataType.STRING(40), allowNull: false, defaultValue: 'returned' }) declare status: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare notes?: string;
  @ForeignKey(() => SysUser) @Column({ type: DataType.BIGINT, allowNull: true }) declare returned_by_id?: number;
  @BelongsTo(() => SysUser, { foreignKey: 'returned_by_id', targetKey: 'id', as: 'returnedBy' }) declare returnedBy?: SysUser;
  @HasMany(() => ProcurementHireOutItem, { foreignKey: 'hire_out_id', sourceKey: 'uuid', as: 'items' }) declare items?: ProcurementHireOutItem[];
  @Column({ type: DataType.STRING, allowNull: true }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deletedBy?: string;


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
