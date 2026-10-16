import type { LandInfrastructureAttributes, LandInfrastructureCreationAttributes } from '../../../types/landinfrastructure.types';

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from '../project/pr_project.model';

export enum LandInfrastructureKind {
  ROAD = 'road',
  BLOCK = 'block',
}

@Table({
  tableName: 'pr_land_infrastructure',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    { name: 'pr_land_infrastructure_project_id_idx', fields: ['projectId'] },
    { name: 'pr_land_infrastructure_kind_idx', fields: ['kind'] },
  ],
})
export class LandInfrastructure extends BaseModel<LandInfrastructureAttributes, LandInfrastructureCreationAttributes> {
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({
    type: DataType.ENUM(...Object.values(LandInfrastructureKind)),
    allowNull: false,
  })
  declare kind: LandInfrastructureKind;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare size?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare details?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string;
}
