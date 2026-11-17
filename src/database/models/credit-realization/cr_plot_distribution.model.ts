import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrSaleAgreement } from './cr_sale_agreement.model';

import type { CrPlotDistributionAttributes, CrPlotDistributionCreationAttributes } from '../../types/crplotdistribution.types';

@Table({
  tableName: 'cr_plot_distributions',
  timestamps: true,
  paranoid: true,
})
export class CrPlotDistribution extends BaseModel<CrPlotDistributionAttributes, CrPlotDistributionCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  sale_agreement_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  plot_no: string;

  @Column({ type: DataType.STRING, allowNull: true })
  road_no?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  sector_block?: string;

  @Column({ type: DataType.DECIMAL(8, 2), allowNull: true })
  plot_size_katha?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  facing?: string;

  @Column({ type: DataType.STRING, defaultValue: 'provisional' })
  allotment_status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  allotment_letter_no?: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  allotment_date?: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  registration_date?: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  mutation_date?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'org_id' })
  declare org_id?: string;

  @BelongsTo(() => CrSaleAgreement, { foreignKey: 'sale_agreement_id' })
  sale_agreement: CrSaleAgreement;
}
