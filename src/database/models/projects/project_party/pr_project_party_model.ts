/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';
import {
  ProjectPartyAttributes,
  ProjectPartyCreationAttributes,
  ProjectPartyUpdateAttributes,
} from 'src/database/types/projectparty.types';

export enum PartyType {
  INVESTOR = 'Investor',
  OWNER = 'Owner',
  DEVELOPER = 'Developer',
  CONTRACTOR = 'Contractor',
  CONSULTANT = 'Consultant', // ✅ নতুন যোগ করুন
  BUYER = 'Buyer',           // ✅ নতুন যোগ করুন
  SUPPLIER = 'Supplier',     // ✅ নতুন যোগ করুন
  OTHER = 'Other',
}

@Table({
  tableName: 'project_party',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProjectParty
  extends BaseModel<
    ProjectPartyAttributes,
    ProjectPartyCreationAttributes
  >
  implements ProjectPartyAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4, // ✅ Auto-generate UUID
  })
  declare uuid: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectUuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare partyCode: string;

  @Column({
    type: DataType.ENUM(...Object.values(PartyType)),
    allowNull: false,
    defaultValue: PartyType.INVESTOR,
  })
  declare partyType: PartyType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare partyBusinessName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare email?: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare equityShare: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare agreementRef?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedBy?: string;

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