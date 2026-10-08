/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import {
  MaterialRequisitionAttributes,
  MaterialRequisitionCreationAttributes,
  MaterialRequisitionUpdateAttributes,
} from 'src/database/types/materialrequisition.types';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Table({
  tableName: 'material_requisitions',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class MaterialRequisition
  extends BaseModel<
    MaterialRequisitionUpdateAttributes,
    MaterialRequisitionCreationAttributes
  >
  implements MaterialRequisitionAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare projectType: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare projectName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare titleOrNameOfWork: string;

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
  declare referenceNumber: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare demandDate: Date | string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare company: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare supplier?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare attachmentUrl?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare approvalLayer?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ApprovalStatus),
    ),
    allowNull: false,
    defaultValue: ApprovalStatus.PENDING,
  })
  declare status: ApprovalStatus;

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
