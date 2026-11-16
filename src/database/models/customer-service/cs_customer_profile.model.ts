import {
  BeforeValidate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { CrmParty } from '../crm/lead/crm-party.model';
import { CustomerAccount } from '../projects/contract/pr_customer_accounts.model';
import { Project } from '../projects/project/pr_project.model';

import type {
  CsCustomerProfileAttributes,
  CsCustomerProfileCreationAttributes,
} from '../../types/cscustomerprofile.types';

export enum CustomerProfileStatus {
  ACTIVE = 'active',
  VIP = 'vip',
  DISPUTED = 'disputed',
  CLOSED = 'closed',
}

@Table({
  tableName: 'cs_customer_profiles',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_customer_profiles_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_cust_status_deleted',
      fields: ['customer_status', 'deleted_at'],
    },
    {
      name: 'idx_cs_cust_deleted_at',
      fields: ['deleted_at'],
    },
  ],
})
export class CsCustomerProfile extends TenantBaseModel<
  CsCustomerProfileAttributes,
  CsCustomerProfileCreationAttributes
> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
  })
  declare projectId?: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'customer_code',
  })
  declare customerCode: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'customer_name',
  })
  declare customerName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'phone_number',
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    field: 'email',
  })
  declare email?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'nid_number',
  })
  declare nidNumber: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'tin_number',
  })
  declare tinNumber?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'address',
  })
  declare address?: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    field: 'nominee_name',
  })
  declare nomineeName?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    defaultValue: 'Spouse',
    field: 'nominee_relation',
  })
  declare nomineeRelation?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'nominee_nid',
  })
  declare nomineeNid?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(CustomerProfileStatus),
    ),
    allowNull: false,
    defaultValue: CustomerProfileStatus.ACTIVE,
    field: 'customer_status',
  })
  declare customerStatus: CustomerProfileStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'joined_date',
  })
  declare joinedDate: string;

  @ForeignKey(() => CrmParty)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'party_id',
  })
  declare partyId?: number;

  @BelongsTo(() => CrmParty, {
    foreignKey: 'partyId',
    as: 'party',
  })
  declare party?: CrmParty;

  @ForeignKey(() => CustomerAccount)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'customer_account_id',
  })
  declare customerAccountId?: number;

  @BelongsTo(() => CustomerAccount, {
    foreignKey: 'customerAccountId',
    as: 'customerAccount',
  })
  declare customerAccount?: CustomerAccount;

  @BeforeValidate
  static generateCustomerCode(
    instance: CsCustomerProfile,
  ) {
    if (!instance.customerCode) {
      instance.customerCode = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }
}
