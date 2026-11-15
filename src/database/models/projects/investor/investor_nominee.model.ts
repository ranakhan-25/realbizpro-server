/* eslint-disable prettier/prettier */

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';

import {
  InvestorNomineeAttributes,
  InvestorNomineeCreationAttributes,
  InvestorNomineeUpdateAttributes,
} from 'src/database/types/investornominee.types';

import { Investor } from './investor.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

@Table({
  tableName: 'investor_nominees',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class InvestorNominee
  extends BaseModel<
    InvestorNomineeUpdateAttributes,
    InvestorNomineeCreationAttributes
  >
  implements InvestorNomineeAttributes
{
  @ForeignKey(() => Investor)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'investors',
      key: 'uuid',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare investorId: string;

  @BelongsTo(() => Investor, {
    foreignKey: 'investorId',
    targetKey: 'uuid',
  })
  declare investor?: Investor;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nomineeName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nomineeNid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare relation: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  declare percentage: number;
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
