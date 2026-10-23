import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Party } from './party.model';

import type { PartyDocumentAttributes, PartyDocumentCreationAttributes } from '../../../types/partydocument.types';

@Table({ tableName: 'party_documents', timestamps: true, paranoid: true, underscored: true })
export class PartyDocument extends BaseModel<PartyDocumentAttributes, PartyDocumentCreationAttributes> {
  @ForeignKey(() => Party)
  @Column({ type: DataType.UUID, allowNull: false, field: 'party_id' }) declare partyId: string;
  @Column({ type: DataType.STRING(200), allowNull: false }) declare title: string;
  @Column({ type: DataType.TEXT, allowNull: false }) declare file: string;
  @BelongsTo(() => Party, { foreignKey: 'partyId', targetKey: 'uuid', as: 'party' }) declare party?: Party;
}
