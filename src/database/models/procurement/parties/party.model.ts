import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { PartyDocument } from './party-document.model';

import type { PartyAttributes, PartyCreationAttributes } from '../../../types/party.types';

export enum PartyType { VENDOR = 'Vendor', CUSTOMER = 'Customer', CONTRACTOR = 'Contractor', SUBCONTRACTOR = 'Subcontractor', OTHER = 'Other' }
export enum PartyBusinessType { INDIVIDUAL = 'Individual', PROPRIETORSHIP = 'Proprietorship', PARTNERSHIP = 'Partnership', PRIVATE_LIMITED = 'Private Limited', PUBLIC_LIMITED = 'Public Limited', NGO = 'NGO', OTHER = 'Other' }
export enum PartyStatus { ACTIVE = 'active', INACTIVE = 'inactive' }

@Table({ tableName: 'parties', timestamps: true, paranoid: true, underscored: true })
export class Party extends BaseModel<PartyAttributes, PartyCreationAttributes> {
  @Column({ type: DataType.STRING(40), allowNull: false, unique: true }) declare code: string;
  @Column({ type: DataType.STRING(200), allowNull: false }) declare name: string;
  @Column({ type: DataType.ENUM(...Object.values(PartyType)), allowNull: false }) declare type: PartyType;
  @Column({ type: DataType.STRING(200), allowNull: true }) declare contactPerson?: string;
  @Column({ type: DataType.STRING(40), allowNull: true }) declare phone?: string;
  @Column({ type: DataType.STRING(200), allowNull: true, validate: { isEmail: true } }) declare email?: string;
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true }) declare isActive: boolean;
  @Column({ type: DataType.TEXT, allowNull: true }) declare address?: string;
  @Column({ type: DataType.STRING(120), allowNull: true }) declare city?: string;
  @Column({ type: DataType.STRING(120), allowNull: true }) declare state?: string;
  @Column({ type: DataType.STRING(120), allowNull: true }) declare country?: string;
  @Column({ type: DataType.STRING(40), allowNull: true }) declare whatsapp?: string;
  @Column({ type: DataType.STRING(120), allowNull: true }) declare tradeLicenseNo?: string;
  @Column({ type: DataType.DATEONLY, allowNull: true }) declare tradeLicenseExpiry?: string;
  @Column({ type: DataType.STRING(120), allowNull: true }) declare nidNo?: string;
  @Column({ type: DataType.STRING(120), allowNull: true }) declare tinNo?: string;
  @Column({ type: DataType.STRING(120), allowNull: true }) declare binNo?: string;
  @Column({ type: DataType.STRING(200), allowNull: true }) declare ownerName?: string;
  @Column({ type: DataType.ENUM(...Object.values(PartyBusinessType)), allowNull: true }) declare businessType?: PartyBusinessType;
  @Column({ type: DataType.STRING(200), allowNull: true }) declare bankName?: string;
  @Column({ type: DataType.STRING(120), allowNull: true }) declare accountNo?: string;
  @Column({ type: DataType.STRING(120), allowNull: true }) declare branch?: string;
  @Column({ type: DataType.STRING(200), allowNull: true }) declare accountingGroup?: string;
  @Column({ type: DataType.STRING(200), allowNull: true }) declare payableAccount?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare notes?: string;
  @Column({ type: DataType.ENUM(...Object.values(PartyStatus)), allowNull: false, defaultValue: PartyStatus.ACTIVE }) declare status: PartyStatus;
  @HasMany(() => PartyDocument, { foreignKey: 'partyId', sourceKey: 'uuid', as: 'documents', onDelete: 'CASCADE' }) declare documents?: PartyDocument[];
}
