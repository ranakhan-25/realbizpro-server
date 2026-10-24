import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementBoq } from './pr_procurement_boq.model';
import type { ProcurementBoqNoteAttributes, ProcurementBoqNoteCreationAttributes } from '../../../types/procurementboqnote.types';

@Table({ tableName: 'pr_procurement_boq_notes', timestamps: true, paranoid: true, underscored: true })
export class ProcurementBoqNote extends BaseModel<ProcurementBoqNoteAttributes, ProcurementBoqNoteCreationAttributes> {
  @ForeignKey(() => ProcurementBoq) @Column({ type: DataType.UUID, allowNull: false }) declare boq_id: string;
  @BelongsTo(() => ProcurementBoq, { foreignKey: 'boq_id', targetKey: 'uuid', as: 'boq', onDelete: 'CASCADE' }) declare boq?: ProcurementBoq;
  @Column({ type: DataType.TEXT, allowNull: false }) declare note: string;
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 }) declare sort_order: number;
}
