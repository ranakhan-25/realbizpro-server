/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  UnderAttributes,
  UnderCreationAttributes,
  UnderUpdateAttributes,
} from 'src/database/types/under.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

export enum UnderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'under',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    { name: 'Under_name_idx', fields: ['name'] },
    {
      name: 'Under_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Under
  extends BaseModel<
    UnderUpdateAttributes,
    UnderCreationAttributes
  >
  implements UnderAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
          type: DataType.STRING,
          allowNull: true,
          field: 'created_by',
        })
  declare createdBy?: string;

  @Column({
          type: DataType.STRING,
          allowNull: true,
          field: 'updated_by',
        })
  declare updatedBy?: string;

  @Column({
          type: DataType.STRING,
          allowNull: true,
          field: 'deleted_by',
        })
  declare deletedBy?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(UnderStatus),
    ),
    allowNull: false,
    defaultValue: UnderStatus.ACTIVE,
  })
  declare status: UnderStatus;
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
}
