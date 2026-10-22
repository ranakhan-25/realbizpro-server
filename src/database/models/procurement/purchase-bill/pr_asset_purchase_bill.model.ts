import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { SysUser } from '../../system/sys_user.model';
import { SupplierAccounts } from '../../projects/contract/pr_supplier_accounts.model';
import { Project } from '../../projects/project/pr_project.model';
import { ProjectType } from '../../projects/project-type/pr_project_type.model';
import { ProcurementAssetGrn } from '../grn/pr_asset_grn.model';
import { ProcurementAssetPurchaseBillGrn } from './pr_asset_purchase_bill_grn.model';
import type { ProcurementAssetPurchaseBillAttributes, ProcurementAssetPurchaseBillCreationAttributes } from '../../../types/procurementassetpurchasebill.types';

@Table({ tableName: 'pr_asset_purchase_bill', timestamps: true, paranoid: true, underscored: true })
export class ProcurementAssetPurchaseBill extends BaseModel<ProcurementAssetPurchaseBillAttributes, ProcurementAssetPurchaseBillCreationAttributes> {
  @Column({ type: DataType.DATEONLY, allowNull: false }) declare date: string;
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true }) declare code: string;
  @ForeignKey(() => ProjectType) @Column({ type: DataType.UUID, allowNull: true }) declare project_type_id?: string;
  @BelongsTo(() => ProjectType, { foreignKey: 'project_type_id', targetKey: 'uuid', as: 'projectType' }) declare projectType?: ProjectType;
  @ForeignKey(() => Project) @Column({ type: DataType.UUID, allowNull: true }) declare project_id?: string;
  @BelongsTo(() => Project, { foreignKey: 'project_id', targetKey: 'uuid', as: 'project' }) declare project?: Project;
  @ForeignKey(() => SupplierAccounts) @Column({ type: DataType.UUID, allowNull: false }) declare supplier_id: string;
  @BelongsTo(() => SupplierAccounts, { foreignKey: 'supplier_id', targetKey: 'uuid', as: 'supplier' }) declare supplier?: SupplierAccounts;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare subtotal: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare discount: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare grand_total: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare paid: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare due: number;
  @Column({ type: DataType.TEXT, allowNull: true }) declare note?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare attachment?: string;
  @ForeignKey(() => SysUser) @Column({ type: DataType.BIGINT, allowNull: true }) declare added_by_id?: number;
  @BelongsTo(() => SysUser, { foreignKey: 'added_by_id', targetKey: 'id', as: 'addedBy' }) declare addedBy?: SysUser;
  @Column({ type: DataType.STRING(100), allowNull: false, defaultValue: 'pending' }) declare approval_layer: string;
  @BelongsToMany(() => ProcurementAssetGrn, { through: () => ProcurementAssetPurchaseBillGrn, foreignKey: 'purchase_bill_id', otherKey: 'grn_id', sourceKey: 'uuid', targetKey: 'uuid', as: 'grns' }) declare grns?: ProcurementAssetGrn[];
  @Column({ type: DataType.STRING, allowNull: true }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deletedBy?: string;
}
