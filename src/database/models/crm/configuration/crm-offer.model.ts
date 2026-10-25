import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';

import type { CrmOfferAttributes, CrmOfferCreationAttributes } from '../../../types/crmoffer.types';

@Table({ tableName: 'crm_offers', timestamps: true, paranoid: true, underscored: true })
export class CrmOffer extends BaseModel<CrmOfferAttributes, CrmOfferCreationAttributes> {
  @Column({ type: DataType.STRING(200), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'active' })
  declare status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @HasMany(() => Lead, { foreignKey: 'offerId', sourceKey: 'id', as: 'leads' })
  declare leads?: Lead[];
}
