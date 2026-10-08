import {
  BeforeValidate,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import {
  projectTypeAttributes as ProjectTypeAttributes,
  projectTypeCreationAttributes as ProjectTypeCreationAttributes,
} from 'src/database/types/projecttype.types';

@Table({
  tableName: 'project_types',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class projectType
  extends BaseModel<
    ProjectTypeAttributes,
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
  static generateCode(
    instance: ProjectTypeAttributes,
  ) {
    if (!instance.code) {
      instance.code = `P${Math.floor(1000000 + Math.random() * 9000000)}`;
    }
  }
}
