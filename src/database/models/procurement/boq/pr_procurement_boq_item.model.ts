import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementBoq } from './pr_procurement_boq.model';
import { ProcurementItemEntry } from '../configuration/products/pr_item_entry.model';
import { ProcurementUnit } from '../configuration/products/pr_unit.model';
import { Category } from '../configuration/products/pr_category.model';
import type { ProcurementBoqItemAttributes, ProcurementBoqItemCreationAttributes } from '../../../types/procurementboqitem.types';

export enum ProcurementBoqCostType { MATERIAL = 'material', EQUIPMENT_MISC = 'equipment_misc', LABOUR = 'labour', SUBCONTRACT = 'subcontract' }
@Table({ tableName: 'pr_procurement_boq_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementBoqItem extends BaseModel<ProcurementBoqItemAttributes, ProcurementBoqItemCreationAttributes> {
  @ForeignKey(() => ProcurementBoq) @Column({ type: DataType.UUID, allowNull: false }) declare boq_id: string;
  @BelongsTo(() => ProcurementBoq, { foreignKey: 'boq_id', targetKey: 'uuid', as: 'boq', onDelete: 'CASCADE' }) declare boq?: ProcurementBoq;
  @ForeignKey(() => ProcurementItemEntry) @Column({ type: DataType.UUID, allowNull: true }) declare item_id?: string;
  @BelongsTo(() => ProcurementItemEntry, { foreignKey: 'item_id', targetKey: 'uuid', as: 'item' }) declare item?: ProcurementItemEntry;
  @ForeignKey(() => Category) @Column({ type: DataType.UUID, allowNull: true }) declare category_id?: string;
  @BelongsTo(() => Category, { foreignKey: 'category_id', targetKey: 'uuid', as: 'category' }) declare category?: Category;
  @ForeignKey(() => ProcurementUnit) @Column({ type: DataType.UUID, allowNull: true }) declare unit_id?: string;
  @BelongsTo(() => ProcurementUnit, { foreignKey: 'unit_id', targetKey: 'uuid', as: 'unitRelation' }) declare unitRelation?: ProcurementUnit;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare item_name: string;
  @Column({ type: DataType.STRING(100), allowNull: true }) declare item_code?: string;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare unit: string;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare quantity: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare rate: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare amount: number;
  @Column({ type: DataType.ENUM(...Object.values(ProcurementBoqCostType)), allowNull: false, defaultValue: ProcurementBoqCostType.MATERIAL }) declare cost_type: ProcurementBoqCostType;
  @Column({ type: DataType.TEXT, allowNull: true }) declare remarks?: string;
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 }) declare sort_order: number;
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
