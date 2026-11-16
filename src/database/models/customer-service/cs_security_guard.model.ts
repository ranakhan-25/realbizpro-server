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
import { CsSecurityCompany } from './cs_security_company.model';
import type {
  CsSecurityGuardAttributes,
  CsSecurityGuardCreationAttributes,
} from '../../types/cssecurityguard.types';
import type { GuardSource, GuardStatus } from './cs_security.types';
import { CsSecurityRoster } from './cs_security_roster.model';

@Table({
  tableName: 'cs_security_guards',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_sec_guards_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_sec_guards_company',
      fields: ['company_id'],
    },
    {
      name: 'idx_cs_sec_guards_source',
      fields: ['source'],
    },
  ],
})
export class CsSecurityGuard extends TenantBaseModel<
  CsSecurityGuardAttributes,
  CsSecurityGuardCreationAttributes
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
    type: DataType.STRING(150),
    allowNull: false,
    field: 'name',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'phone',
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'national_id',
  })
  declare nationalId: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'source',
  })
  declare source: GuardSource;

  @ForeignKey(() => CsSecurityCompany)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'company_id',
  })
  declare companyId?: number | null;

  @BelongsTo(() => CsSecurityCompany, {
    foreignKey: 'companyId',
    as: 'company',
  })
  declare company?: CsSecurityCompany;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'badge_number',
  })
  declare badgeNumber?: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'ACTIVE',
    field: 'status',
  })
  declare status: GuardStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'joined_date',
  })
  declare joinedDate: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'emergency_contact',
  })
  declare emergencyContact?: string | null;

  @HasMany(() => CsSecurityRoster, {
    foreignKey: 'guardId',
    as: 'rosters',
  })
  declare rosters?: CsSecurityRoster[];
}

