import { Column, DataType, Table, ForeignKey, BelongsTo, Index, PrimaryKey, Default } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { AcquisitionLead } from './acquisition-lead.model';

import type { LandOwnerAttributes, LandOwnerCreationAttributes } from '../../types/landowner.types';

@Table({
  tableName: 'lams_land_owners',
  timestamps: true,
  paranoid: true,
})
export class LandOwner extends BaseModel<LandOwnerAttributes, LandOwnerCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_land_owner_org_id' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare org_id: string;

  @ForeignKey(() => AcquisitionLead)
  @Index({ name: 'idx_land_owner_lead_id' })
  @Column({ type: DataType.UUID, allowNull: true })
  lead_id?: any;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'Owner' })
  owner_type: string; // 'Owner' or 'Broker'

  @Index({ name: 'idx_land_owner_name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  father_name?: string;

  @Index({ name: 'idx_land_owner_contact' })
  @Column({ type: DataType.STRING, allowNull: true })
  contact_number?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  email?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  address?: string;

  @Index({ name: 'idx_land_owner_nid' })
  @Column({ type: DataType.STRING, allowNull: true })
  nid_number?: string;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: true, defaultValue: 100.00 })
  ownership_percentage?: number;

  @Column({ type: DataType.STRING(150), allowNull: true })
  bank_name?: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  bank_account?: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  nominee_json?: any;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  added_by?: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number;

  @BelongsTo(() => AcquisitionLead, { foreignKey: 'lead_id', as: 'acquisition_lead' })
  declare acquisition_lead?: AcquisitionLead;
}
