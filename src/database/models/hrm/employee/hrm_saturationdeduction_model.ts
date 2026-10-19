import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  SaturationDeductionAttributes,
  SaturationDeductionCreationAttributes,
  SaturationDeductionUpdateAttributes,
} from 'src/database/types/saturationdeduction.types';
import { EmployeeList } from './hrm_employeeList_model';
import { PaymentType } from './hrm_payment_enum';
// fix: Allowance model theke na, alada enum file theke

@Table({
  tableName: 'saturation_deduction',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'SaturationDeduction_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'SaturationDeduction_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class SaturationDeduction
  extends BaseModel<
    SaturationDeductionUpdateAttributes,
    SaturationDeductionCreationAttributes
  >
  implements SaturationDeductionAttributes
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
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(PaymentType),
    ),
    allowNull: true,
  })
  declare paymentType?: PaymentType;

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
