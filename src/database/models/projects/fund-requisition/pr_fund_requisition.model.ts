/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import {
  FundRequisitionAttributes,
  FundRequisitionCreationAttributes,
  FundRequisitionUpdateAttributes,
} from 'src/database/types/fundrequisition.types';

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
    type: DataType.STRING,
    allowNull: true,
  })
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
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;
}
