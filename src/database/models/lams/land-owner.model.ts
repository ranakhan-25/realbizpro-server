import { Column, DataType, Table, ForeignKey, BelongsTo, Index, PrimaryKey, Default } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { AcquisitionLead } from './acquisition-lead.model';

@Table({
  tableName: 'lams_land_owners',
  timestamps: true,
  paranoid: true,
})
export class LandOwner extends BaseModel {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @ForeignKey(() => AcquisitionLead)
  @Index({ name: 'idx_land_owner_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  lead_id: any;

  @Column({ type: DataType.STRING, allowNull: false })
  owner_type: string; // 'Owner' or 'Broker'

  @Index({ name: 'idx_land_owner_name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Index({ name: 'idx_land_owner_contact' })
  @Column({ type: DataType.STRING })
  contact_number: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.TEXT })
  address: string;

  @Index({ name: 'idx_land_owner_nid' })
  @Column({ type: DataType.STRING })
  nid_number: string;

  @Column({ type: DataType.DECIMAL(5, 2) })
  ownership_percentage: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  added_by?: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number;

  @BelongsTo(() => AcquisitionLead)
  acquisition_lead: AcquisitionLead;
}
