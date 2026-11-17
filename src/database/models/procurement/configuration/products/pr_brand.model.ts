import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
/* eslint-disable prettier/prettier */

import { Column, DataType, HasMany, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  ProcurementBrandAttributes,
  ProcurementBrandCreationAttributes,
  ProcurementBrandUpdateAttributes,
} from 'src/database/types/procurementbrand.types';
import { ProcurementItemEntry } from './pr_item_entry.model';
import { ProcurementAssetItemEntry } from '../asset/pr_asset_item_entry.model';

@Table({
  tableName: 'pr_brand',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProcurementBrand
  extends BaseModel<
    ProcurementBrandUpdateAttributes,
    ProcurementBrandCreationAttributes
  >
  implements ProcurementBrandAttributes
{
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @HasMany(() => ProcurementItemEntry, { foreignKey: 'brand_id', sourceKey: 'uuid', as: 'itemEntries' })
  declare itemEntries?: ProcurementItemEntry[];

  @HasMany(() => ProcurementAssetItemEntry, { foreignKey: 'brand_id', sourceKey: 'uuid', as: 'assetItems' })
  declare assetItems?: ProcurementAssetItemEntry[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;


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

}
