import {
  Column,
  DataType,
  Table,
  HasMany,
  Index,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { LandOwner } from './land-owner.model';
import { FollowUp } from './follow-up.model';
import { NegotiationProcess } from './negotiation-process.model';
import { LegalDocument } from './legal-document.model';

import type {
  AcquisitionLeadAttributes,
  AcquisitionLeadCreationAttributes,
} from '../../types/acquisitionlead.types';

@Table({
  tableName: 'lams_acquisition_leads',
  timestamps: true,
  paranoid: true,
})
export class AcquisitionLead extends BaseModel<
  AcquisitionLeadAttributes,
  AcquisitionLeadCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  declare id: any;

  @Index({ name: 'idx_acquisition_lead_org_id' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare org_id: string;

  @Index({ name: 'idx_lead_code' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  lead_code?: string;

  @Index({ name: 'idx_lead_title' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lead_title: string;

  @Index({ name: 'idx_lead_date' })
  @Column({ type: DataType.DATEONLY })
  lead_date: Date;

  @Index({ name: 'idx_land_type' })
  @Column({ type: DataType.STRING })
  land_type: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  land_area: number;

  @Column({
    type: DataType.DECIMAL(12, 4),
    allowNull: true,
    defaultValue: 0,
  })
  area_katha?: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
  })
  area_sqft?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  location?: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  mouza?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  khatian_no?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  dag_no?: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
  })
  asking_price?: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: 'Direct Owner',
  })
  source?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    defaultValue: 'Medium',
  })
  priority?: string;

  @Index({ name: 'idx_lead_status' })
  @Column({
    type: DataType.STRING,
    defaultValue: 'New',
  })
  lead_status: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  assigned_to?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  co_owners_json?: any;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  map_url?: string;

  @Index({ name: 'idx_created_by' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  created_by?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  added_by?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  deleted_by?: number;

  @HasMany(() => LandOwner, { foreignKey: 'lead_id', as: 'land_owners' })
  declare land_owners?: LandOwner[];

  @HasMany(() => FollowUp, { foreignKey: 'lead_id', as: 'follow_ups' })
  declare follow_ups?: FollowUp[];

  @HasMany(() => NegotiationProcess, { foreignKey: 'lead_id', as: 'negotiation_processes' })
  declare negotiation_processes?: NegotiationProcess[];

  @HasMany(() => LegalDocument, { foreignKey: 'lead_id', as: 'legal_documents' })
  declare legal_documents?: LegalDocument[];
}
