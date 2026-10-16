import { Column, DataType, Table, ForeignKey, BelongsTo, Index, PrimaryKey, Default } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { AcquisitionLead } from './acquisition-lead.model';

import type { LegalDocumentAttributes, LegalDocumentCreationAttributes } from '../../types/legaldocument.types';

@Table({
  tableName: 'lams_legal_documents',
  timestamps: true,
  paranoid: true,
})
export class LegalDocument extends BaseModel<LegalDocumentAttributes, LegalDocumentCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @ForeignKey(() => AcquisitionLead)
  @Index({ name: 'idx_legal_document_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  lead_id: any;

  @Column({ type: DataType.STRING })
  document_type: string;

  @Index({ name: 'idx_legal_document_number' })
  @Column({ type: DataType.STRING })
  document_number: string;

  @Column({ type: DataType.DATEONLY })
  issue_date: Date;

  @Column({ type: DataType.STRING })
  file_path: string;

  @Index({ name: 'idx_legal_document_status' })
  @Column({ type: DataType.STRING, defaultValue: 'Pending' })
  verification_status: string;

  @Column({ type: DataType.TEXT })
  vetting_remarks: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  added_by?: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectId?: string;

  @BelongsTo(() => AcquisitionLead, { foreignKey: 'lead_id', as: 'acquisition_lead' })
  declare acquisition_lead?: AcquisitionLead;
}
