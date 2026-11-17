/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  HasMany,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { MaterialRequisition } from '../material-requisition/pr_material_requisition.model';
import { Quotation } from '../quatation/pr_quotation.model';
import { BillingSubCategory } from './pr_sub_category.model';

import { BaseModel } from 'src/database/base.model';
import type {
  BillingCategoryAttributes,
  BillingCategoryCreationAttributes,
} from 'src/database/types/billingcategory.types';
import { WorkOrder } from './work-order/pr_work_order.model';
import { ProcurementRfq } from '../../procurement/rfq/pr_rfq.model';
import { ProcurementAssetRfq } from '../../procurement/rfq/pr_asset_rfq.model';
import { ProcurementMaterialRequisition } from '../../procurement/requisition/pr_material_requisition.model';
import { ProcurementAssetRequisition } from '../../procurement/requisition/pr_asset_requisition.model';
import { ProcurementPurchaseOrder } from '../../procurement/purchase-order/pr_purchase_order.model';
import { ProcurementAssetPurchaseOrder } from '../../procurement/purchase-order/pr_asset_purchase_order.model';
import { ProcurementGrn } from '../../procurement/grn/pr_grn.model';
import { ProcurementAssetGrn } from '../../procurement/grn/pr_asset_grn.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

export enum CategoryType {
  PRODUCT = 'Product',
  SERVICE = 'Service',
}

@Table({
  tableName: 'categories',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class BillingCategory
  extends BaseModel<
    BillingCategoryAttributes,
    BillingCategoryCreationAttributes
  >
  implements BillingCategoryAttributes
{
  @Column({
    type: DataType.ENUM(
      ...Object.values(CategoryType),
    ),
    allowNull: false,
  })
  declare type: CategoryType;

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
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @HasMany(() => MaterialRequisition, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'materialRequisitions',
  })
  declare materialRequisitions?: MaterialRequisition[];

  @HasMany(() => BillingSubCategory, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'subCategories',
  })
  declare subCategories?: BillingSubCategory[];

  @HasMany(() => Quotation, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'quotations',
  })
  declare quotations?: Quotation[];

  @HasMany(() => WorkOrder, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'workOrders',
  })
  declare workOrders?: WorkOrder[];

  @HasMany(() => ProcurementRfq, { foreignKey: 'title_of_work_id', sourceKey: 'uuid', as: 'procurementRfqs' }) declare procurementRfqs?: ProcurementRfq[];
  @HasMany(() => ProcurementAssetRfq, { foreignKey: 'title_of_work_id', sourceKey: 'uuid', as: 'procurementAssetRfqs' }) declare procurementAssetRfqs?: ProcurementAssetRfq[];
  @HasMany(() => ProcurementMaterialRequisition, { foreignKey: 'title_of_work_id', sourceKey: 'uuid', as: 'procurementMaterialRequisitions' }) declare procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  @HasMany(() => ProcurementAssetRequisition, { foreignKey: 'title_of_work_id', sourceKey: 'uuid', as: 'procurementAssetRequisitions' }) declare procurementAssetRequisitions?: ProcurementAssetRequisition[];
  @HasMany(() => ProcurementPurchaseOrder, { foreignKey: 'title_of_work_id', sourceKey: 'uuid', as: 'procurementPurchaseOrders' }) declare procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  @HasMany(() => ProcurementAssetPurchaseOrder, { foreignKey: 'title_of_work_id', sourceKey: 'uuid', as: 'procurementAssetPurchaseOrders' }) declare procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  @HasMany(() => ProcurementGrn, { foreignKey: 'title_of_work_id', sourceKey: 'uuid', as: 'procurementGrns' }) declare procurementGrns?: ProcurementGrn[];
  @HasMany(() => ProcurementAssetGrn, { foreignKey: 'title_of_work_id', sourceKey: 'uuid', as: 'procurementAssetGrns' }) declare procurementAssetGrns?: ProcurementAssetGrn[];

  @Column({
          field: 'created_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare createdBy?: string;

  @Column({
          field: 'updated_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare updatedBy?: string;

  @Column({
          field: 'deleted_by',
          type: DataType.STRING,
          allowNull: true,
        })
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
}
