import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  SalaryGradeAttributes,
  SalaryGradeCreationAttributes,
  SalaryGradeUpdateAttributes,
} from 'src/database/types/salarygrade.types';

export enum SalaryGradeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'salary_grade',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'SalaryGrade_name_idx',
      fields: ['name'],
    },
    {
      name: 'SalaryGrade_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class SalaryGrade
  extends BaseModel<
    SalaryGradeUpdateAttributes,
    SalaryGradeCreationAttributes
  >
  implements SalaryGradeAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(SalaryGradeStatus),
    ),
    allowNull: false,
    defaultValue: SalaryGradeStatus.ACTIVE,
  })
  declare status: SalaryGradeStatus;
}
