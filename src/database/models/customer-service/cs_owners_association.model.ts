import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import { AssociationGovernanceStatus } from './cs_property_care.types';
import type {
  CsOwnersAssociationAttributes,
  CsOwnersAssociationCreationAttributes,
} from '../../types/csownersassociation.types';

export { AssociationGovernanceStatus };

@Table({
  tableName: 'cs_owners_associations',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_oa_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_oa_status',
      fields: ['handover_status'],
    },
    {
      name: 'idx_cs_oa_code',
      fields: ['association_code'],
    },
  ],
})
export class CsOwnersAssociation extends TenantBaseModel<
  CsOwnersAssociationAttributes,
  CsOwnersAssociationCreationAttributes
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
    as: 'projectDetails',
  })
  declare projectDetails?: Project;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'project_name',
  })
  declare projectName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'association_code',
  })
  declare associationCode: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'association_name',
  })
  declare associationName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'president_name',
  })
  declare presidentName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'contact_phone',
  })
  declare contactPhone?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_flats',
  })
  declare totalFlats: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'handed_over_count',
  })
  declare handedOverCount: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'monthly_service_charge_per_flat',
  })
  declare monthlyServiceChargePerFlat: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'association_bank_acc',
  })
  declare associationBankAcc?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: AssociationGovernanceStatus.DEVELOPER_MANAGING,
    field: 'handover_status',
  })
  declare handoverStatus: AssociationGovernanceStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'transition_date',
  })
  declare transitionDate?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'remarks',
  })
  declare remarks?: string;
}
