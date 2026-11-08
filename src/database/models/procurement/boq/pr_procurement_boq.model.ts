import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { Project } from '../../projects/project/pr_project.model';
import { SysCompany } from '../../system/sys_company.model';
import { SysUser } from '../../system/sys_user.model';
import { ProcurementBoqItem } from './pr_procurement_boq_item.model';
import { ProcurementBoqNote } from './pr_procurement_boq_note.model';

import type { ProcurementBoqAttributes, ProcurementBoqCreationAttributes } from '../../../types/procurementboq.types';

export enum ProcurementBoqStatus { PENDING = 'pending', APPROVED = 'approved', REJECTED = 'rejected', COMPLETED = 'completed' }
@Table({ tableName: 'pr_procurement_boq', timestamps: true, paranoid: true, underscored: true })
export class ProcurementBoq extends BaseModel<ProcurementBoqAttributes, ProcurementBoqCreationAttributes> {
  @ForeignKey(() => Project) @Column({ type: DataType.UUID, allowNull: false }) declare project_id: string;
  @BelongsTo(() => Project, { foreignKey: 'project_id', targetKey: 'uuid', as: 'project' }) declare project?: Project;
  @ForeignKey(() => SysCompany) @Column({ type: DataType.UUID, allowNull: true }) declare company_id?: string;
  @BelongsTo(() => SysCompany, { foreignKey: 'company_id', targetKey: 'uuid', as: 'company' }) declare company?: SysCompany;
  @ForeignKey(() => SysUser) @Column({ type: DataType.BIGINT, allowNull: true }) declare responsible_user_id?: number;
  @BelongsTo(() => SysUser, { foreignKey: 'responsible_user_id', targetKey: 'id', as: 'responsibleUser' }) declare responsibleUser?: SysUser;
  @ForeignKey(() => SysUser) @Column({ type: DataType.BIGINT, allowNull: true }) declare added_by_id?: number;
  @BelongsTo(() => SysUser, { foreignKey: 'added_by_id', targetKey: 'id', as: 'addedBy' }) declare addedBy?: SysUser;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare title: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare responsible_person?: string;
  @Column({ type: DataType.DATEONLY, allowNull: false }) declare date: string;
  @Column({ type: DataType.DATEONLY, allowNull: false }) declare due_date: string;
  @Column({ type: DataType.STRING(100), allowNull: false }) declare boq_type: string;
  @Column({ type: DataType.ENUM(...Object.values(ProcurementBoqStatus)), allowNull: false, defaultValue: ProcurementBoqStatus.PENDING }) declare status: ProcurementBoqStatus;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare material_cost: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare equipment_misc_cost: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare labour_cost: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare subcontract_cost: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare subtotal: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare margin_overhead: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare grand_total: number;
  @Column({ type: DataType.TEXT, allowNull: true }) declare remarks?: string;
  @HasMany(() => ProcurementBoqItem, { foreignKey: 'boq_id', sourceKey: 'uuid', as: 'items' }) declare items?: ProcurementBoqItem[];
  @HasMany(() => ProcurementBoqNote, { foreignKey: 'boq_id', sourceKey: 'uuid', as: 'importantNotes' }) declare importantNotes?: ProcurementBoqNote[];
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

}
