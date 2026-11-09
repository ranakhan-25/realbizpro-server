/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  HasMany,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';


import { WorkOrder } from '../billing/work-order/pr_work_order.model';
import { CustomerAccountAttributes, CustomerAccountCreationAttributes, CustomerAccountUpdateAttributes } from 'src/database/types/customeraccount.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

export enum CustomerAccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

@Table({
  tableName: 'customer_account',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class CustomerAccount
  extends BaseModel<
    CustomerAccountUpdateAttributes,
    CustomerAccountCreationAttributes
  >
  implements CustomerAccountAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare customerCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare customerName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare mobileNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare businessName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare nidOrPassport?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare underGroup?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

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

  @Column({
    type: DataType.ENUM(
      ...Object.values(CustomerAccountStatus),
    ),
    allowNull: false,
    defaultValue: CustomerAccountStatus.ACTIVE,
  })
  declare status: CustomerAccountStatus;
  @HasMany(() => WorkOrder, {
    foreignKey: 'customerId',
    sourceKey: 'uuid',
    as: 'workOrders',
  })
  declare workOrders?: WorkOrder[];
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
