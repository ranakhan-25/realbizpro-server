import {
  Table, Column, Model, DataType, PrimaryKey, Default,
  CreatedAt, UpdatedAt, DeletedAt, HasMany, BelongsTo, ForeignKey
} from 'sequelize-typescript';

@Table({
  tableName: 'installment_plans',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [{ name: 'installment_plans_plan_code', unique: true, fields: ['plan_code'] }],
})
export class InstallmentPlan extends Model<InstallmentPlan> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING(50), allowNull: false, field: 'plan_code' })
  declare planCode: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'property_id' })
  declare propertyId: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'buyer_id' })
  declare buyerId: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'total_price' })
  declare totalPrice: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'down_payment' })
  declare downPayment: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  declare financed: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, field: 'interest_rate' })
  declare interestRate: number;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'total_installments' })
  declare totalInstallments: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'monthly_amount' })
  declare monthlyAmount: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'start_date' })
  declare startDate: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'end_date' })
  declare endDate: string;

  @Default('Active')
  @Column({ type: DataType.ENUM('Active', 'Completed', 'Defaulted'), allowNull: false })
  declare status: string;

  @HasMany(() => Installment, { foreignKey: 'planId', sourceKey: 'id', as: 'installments' })
  declare installments: Installment[];

  @CreatedAt @Column({ field: 'created_at' }) declare createdAt: Date;
  @UpdatedAt @Column({ field: 'updated_at' }) declare updatedAt: Date;
  @DeletedAt @Column({ field: 'deleted_at' }) declare deletedAt: Date | null;
}

@Table({ tableName: 'installments', timestamps: true, paranoid: true, underscored: true })
export class Installment extends Model<Installment> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => InstallmentPlan)
  @Column({ type: DataType.UUID, allowNull: false, field: 'plan_id' })
  declare planId: string;

  @BelongsTo(() => InstallmentPlan, { foreignKey: 'planId', as: 'plan' })
  declare plan?: InstallmentPlan;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'installment_no' })
  declare no: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'due_date' })
  declare dueDate: string;

  @Column({ type: DataType.ENUM('Upcoming', 'Due', 'Paid'), allowNull: false, defaultValue: 'Upcoming' })
  declare status: string;

  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'paid_date' })
  declare paidDate?: string;

  // 💡 এখানে field: 'payment_method' যুক্ত করা হলো
  @Column({ type: DataType.STRING, allowNull: true, field: 'payment_method' })
  declare method?: string;

  // 💡 এখানে field: 'transaction_id' যুক্ত করা হলো
  @Column({ type: DataType.STRING, allowNull: true, field: 'transaction_id' })
  declare txn?: string;

  @CreatedAt @Column({ field: 'created_at' }) declare createdAt: Date;
  @UpdatedAt @Column({ field: 'updated_at' }) declare updatedAt: Date;
  @DeletedAt @Column({ field: 'deleted_at' }) declare deletedAt: Date | null;
}