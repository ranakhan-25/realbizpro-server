import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { SysOrganization } from './models/system/sys_organization.model';

export abstract class TenantBaseModel<
  T extends object = any,
  C extends object = T,
> extends BaseModel<T, C> {
  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'organization_id',
  })
  declare organizationId: number;

  @BelongsTo(() => SysOrganization, {
    foreignKey: 'organizationId',
    as: 'organization',
  })
  declare organization?: SysOrganization;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'created_by',
  })
  declare createdBy?: number | null;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'updated_by',
  })
  declare updatedBy?: number | null;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'deleted_by',
  })
  declare deletedBy?: number | null;
}

