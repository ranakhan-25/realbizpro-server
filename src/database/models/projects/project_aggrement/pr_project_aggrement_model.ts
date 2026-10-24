/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript'; // ✅ ForeignKey, BelongsTo বাদ দেওয়া হলো

import { BaseModel } from '../../../base.model';
import {
  ProjectAgreementAttributes,
  ProjectAgreementCreationAttributes,
} from 'src/database/types/projectagreement.types';

export enum AgreementType {
  SERVICE = 'Service',
  PARTNERSHIP = 'Partnership',
  INVESTMENT = 'Investment',
  OTHER = 'Other',
}

export enum AgreementStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  TERMINATED = 'Terminated',
}

@Table({
  tableName: 'project_agreement',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProjectAgreement
  extends BaseModel<
    ProjectAgreementAttributes,
    ProjectAgreementCreationAttributes
  >
  implements Omit<ProjectAgreementAttributes, 'party'>
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectUuid: string;

  // ✅ শুধু সাধারণ কলাম, কোনো ForeignKey ডেকোরেটর নেই
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare partyUuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare agreementCode: string;

  @Column({
    type: DataType.ENUM(...Object.values(AgreementType)),
    allowNull: false,
    defaultValue: AgreementType.SERVICE,
  })
  declare agreementType: AgreementType;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare signedDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare startDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare endDate?: Date;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare contractValue: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare agreementFile?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare notes?: string;

  @Column({
    type: DataType.ENUM(...Object.values(AgreementStatus)),
    allowNull: false,
    defaultValue: AgreementStatus.ACTIVE,
  })
  declare status: AgreementStatus;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedById?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string;
}