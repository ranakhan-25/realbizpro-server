import {
  BeforeValidate,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import {
  ProjectTypeAttributes,
  ProjectTypeCreationAttributes,
  ProjectTypeUpdateAttributes,
} from 'src/database/types/projecttype.types';
import { ProjectShareAssignment } from '../project-share-assignment/pr_project_share_assignment.model';

@Table({
  tableName: 'project_types',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProjectType
  extends BaseModel<
    ProjectTypeUpdateAttributes,
    ProjectTypeCreationAttributes
  >
  implements ProjectTypeAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @HasMany(() => ProjectShareAssignment, {
    foreignKey: 'projectTypeId',
    sourceKey: 'uuid',
    as: 'shareAssignments',
  })
  declare shareAssignments?: ProjectShareAssignment[];

  // ─── Audit fields ───────────────────────────────────────
  @Column({
    type: DataType.INTEGER, // change to STRING / UUID if needed
    allowNull: true,
  })
  declare createdBy?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare updatedBy?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare deletedBy?: number;

  // Image e dekha format: P + 7 digit (e.g. P4773027)
  @BeforeValidate
  static generateCode(instance: ProjectType) {
    if (!instance.code) {
      instance.code = `P${Math.floor(1000000 + Math.random() * 9000000)}`;
    }
  }
}
