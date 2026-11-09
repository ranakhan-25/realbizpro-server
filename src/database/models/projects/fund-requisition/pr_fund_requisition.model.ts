/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import {
  FundRequisitionAttributes,
  FundRequisitionCreationAttributes,
  FundRequisitionUpdateAttributes,
} from 'src/database/types/fundrequisition.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

export enum PaymentStatus {
  PAYMENT_LEFT = 'Payment Left',
  FULLY_PAID = 'Fully Paid',
  PARTIALLY_PAID = 'Partially Paid',
}

export enum ApproveStatus {
  ALL_APPROVAL_DONE = 'All Approval Done',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
}

@Table({
  tableName: 'fund_requisitions',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class FundRequisition
  extends BaseModel<
    FundRequisitionUpdateAttributes,
    FundRequisitionCreationAttributes
  >
  implements FundRequisitionAttributes
{
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectType?: string;

  @Column({
          field: 'project_id',
          type: DataType.STRING,
          allowNull: true,
        })
    @ForeignKey(() => Project)
  declare projectId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare taskId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare siteId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare fromUserId?: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare approvedAmount?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare paidAmount?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare purpose: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare reference?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ApproveStatus),
    ),
    allowNull: true,
    defaultValue: ApproveStatus.PENDING,
  })
  declare approveStatus?: ApproveStatus;

  @Column({
    type: DataType.ENUM(
      ...Object.values(PaymentStatus),
    ),
    allowNull: true,
    defaultValue: PaymentStatus.PAYMENT_LEFT,
  })
  declare paymentStatus?: PaymentStatus;

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
    @BelongsTo(() => Project, {
            foreignKey: 'projectId',
            targetKey: 'uuid',
            as: 'project',
          })
    declare project?: Project;
}
