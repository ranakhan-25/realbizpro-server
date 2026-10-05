import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import type {
  RequisitionAttributes,
  RequisitionCreationAttributes,
  RequisitionUpdateAttributes,
} from 'src/database/types/requisition.types';

export enum ApprovalStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export enum RequisitionStatusEnum {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Table({
  tableName: 'Requisition',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Requisition_requisitionNo_idx',
      fields: ['requisitionNo'],
    },
    {
      name: 'Requisition_projectId_idx',
      fields: ['projectId'],
    },
    {
      name: 'Requisition_status_idx',
      fields: ['status'],
    },
    {
      name: 'Requisition_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Requisition
  extends BaseModel<
    RequisitionUpdateAttributes,
    RequisitionCreationAttributes
  >
  implements RequisitionAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare requisitionNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare referenceNo?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare requisitionDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare demandDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare companyId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare projectId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare titleOfWork: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare department?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ApprovalStatusEnum),
    ),
    allowNull: false,
    defaultValue: ApprovalStatusEnum.PENDING,
  })
  declare approvalStatus: ApprovalStatusEnum;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare attachmentUrl?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(RequisitionStatusEnum),
    ),
    allowNull: false,
    defaultValue: RequisitionStatusEnum.DRAFT,
  })
  declare status: RequisitionStatusEnum;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare remarks?: string;

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
