import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import type {
  CsUtilityTechnicianAttributes,
  CsUtilityTechnicianCreationAttributes,
} from '../../types/csutilitytechnician.types';
import type {
  TechnicianSpecialty,
  TechnicianType,
} from './cs_utility.types';

@Table({
  tableName: 'cs_utility_technicians',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_utility_technicians_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_utility_technicians_specialty',
      fields: ['specialty'],
    },
  ],
})
export class CsUtilityTechnician extends TenantBaseModel<
  CsUtilityTechnicianAttributes,
  CsUtilityTechnicianCreationAttributes
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
    field: 'specialty',
  })
  declare specialty: TechnicianSpecialty;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'In-house',
    field: 'technician_type',
  })
  declare technicianType: TechnicianType;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    field: 'vendor_name',
  })
  declare vendorName?: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  declare isActive: boolean;
}
