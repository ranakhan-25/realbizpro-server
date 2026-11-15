import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
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


  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'org_id',
    defaultValue: null,
  })
  declare orgId?: number | null;

  @BelongsTo(() => SysOrganization, {
    foreignKey: 'orgId',
    targetKey: 'id',
    as: 'organization',
  })
  declare organization?: SysOrganization;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
    defaultValue: null,
  })
  declare projectId?: string | null;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'created_by',
    defaultValue: null,
  })
  declare createdBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'updated_by',
    defaultValue: null,
  })
  declare updatedBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'deleted_by',
    defaultValue: null,
  })
  declare deletedBy?: string | null;

}
