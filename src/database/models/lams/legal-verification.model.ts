import { Column, DataType, Table, Index } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { LamsLegalVerificationAttributes, LamsLegalVerificationCreationAttributes } from '../../types/lamslegalverification.types';

@Table({
  tableName: 'lams_legal_verifications',
  timestamps: true,
  paranoid: true,
})
export class LamsLegalVerification extends BaseModel<LamsLegalVerificationAttributes, LamsLegalVerificationCreationAttributes> {
  @Index({ name: 'idx_legal_verification_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  lead_id: string;

  @Column({ type: DataType.STRING(150), allowNull: true })
  lawyer_name?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  title_clear: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  mutation_ok: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  tax_clear: boolean;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'pending' })
  status: string;

  @Column({ type: DataType.DATEONLY, allowNull: true, defaultValue: DataType.NOW })
  verified_at?: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  opinion?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  report_url?: string;

  @Column({ type: DataType.JSONB, allowNull: true, defaultValue: [] })
  findings_json?: any;

  @Column({ type: DataType.STRING, allowNull: true })
  declare org_id?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
