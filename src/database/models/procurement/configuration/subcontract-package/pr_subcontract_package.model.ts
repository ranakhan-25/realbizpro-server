import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import type { ProcurementSubcontractPackageAttributes, ProcurementSubcontractPackageCreationAttributes } from '../../../../types/procurementsubcontractpackage.types';

export enum SubcontractPackageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({ tableName: 'pr_subcontract_packages', timestamps: true, paranoid: true, underscored: true })
export class ProcurementSubcontractPackage extends BaseModel<ProcurementSubcontractPackageAttributes, ProcurementSubcontractPackageCreationAttributes> {
  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(80), allowNull: false })
  declare unit: string;

  @Column({ type: DataType.ENUM(...Object.values(SubcontractPackageStatus)), allowNull: false, defaultValue: SubcontractPackageStatus.ACTIVE })
  declare status: SubcontractPackageStatus;
}
