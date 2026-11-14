import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import type {
  CsSecurityCompanyAttributes,
  CsSecurityCompanyCreationAttributes,
} from '../../types/cssecuritycompany.types';
import type { SecurityCompanyStatus } from './cs_security.types';
import { CsSecurityGuard } from './cs_security_guard.model';

@Table({
  tableName: 'cs_security_companies',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_sec_companies_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_sec_companies_contract_end',
      fields: ['contract_end'],
    },
  ],
})
export class CsSecurityCompany extends TenantBaseModel<
  CsSecurityCompanyAttributes,
  CsSecurityCompanyCreationAttributes
> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
  })
  declare projectId?: string | null;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: 'name',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'contact_person',
  })
  declare contactPerson: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'phone',
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    field: 'email',
  })
  declare email?: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'contract_start',
  })
  declare contractStart: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'contract_end',
  })
  declare contractEnd: string;

  @Column({
    type: DataType.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'monthly_cost',
  })
  declare monthlyCost: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: '',
    field: 'liability_note',
  })
  declare liabilityNote: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'ACTIVE',
    field: 'status',
  })
  declare status: SecurityCompanyStatus;

  @HasMany(() => CsSecurityGuard, {
    foreignKey: 'companyId',
    as: 'guards',
  })
  declare guards?: CsSecurityGuard[];
}

