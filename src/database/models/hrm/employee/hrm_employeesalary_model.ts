import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import {
  EmployeeSalaryAttributes,
  EmployeeSalaryCreationAttributes,
  EmployeeSalaryUpdateAttributes,
} from 'src/database/types/employeesalary.types';
import { EmployeeList } from './hrm_employeeList_model';

@Table({
  tableName: 'employee_salary',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'EmployeeSalary_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'EmployeeSalary_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class EmployeeSalary
  extends BaseModel<
    EmployeeSalaryUpdateAttributes,
    EmployeeSalaryCreationAttributes
  >
  implements EmployeeSalaryAttributes
{
  @ForeignKey(() => EmployeeList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare employeeId: string;

  @BelongsTo(() => EmployeeList, {
    foreignKey: 'employeeId',
    targetKey: 'uuid',
    as: 'employee',
  })
  declare employee?: EmployeeList;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare basicSalary: number;

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
}
