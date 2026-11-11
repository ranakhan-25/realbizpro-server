/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';
import {
  ProjectPartyAttributes,
  ProjectPartyCreationAttributes,
  ProjectPartyUpdateAttributes,
} from 'src/database/types/projectparty.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

export enum PartyType {
  INVESTOR = 'Investor',
  OWNER = 'Owner',
  DEVELOPER = 'Developer',
  CONTRACTOR = 'Contractor',
  CONSULTANT = 'Consultant', // ✅ নতুন যোগ করুন
  BUYER = 'Buyer',           // ✅ নতুন যোগ করুন
  SUPPLIER = 'Supplier',     // ✅ নতুন যোগ করুন
  OTHER = 'Other',
}

@Table({
  tableName: 'project_party',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProjectParty
  extends BaseModel<
    ProjectPartyAttributes,
    ProjectPartyCreationAttributes
  >
  implements ProjectPartyAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4, // ✅ Auto-generate UUID
  })
  declare uuid: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectUuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare partyCode: string;

  @Column({
    type: DataType.ENUM(...Object.values(PartyType)),
    allowNull: false,
    defaultValue: PartyType.INVESTOR,
  })
  declare partyType: PartyType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare partyBusinessName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare email?: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare equityShare: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare agreementRef?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
          field: 'created_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare createdBy?: string;

  @Column({
          field: 'updated_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare updatedBy?: string;

  @Column({
          field: 'deleted_by',
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