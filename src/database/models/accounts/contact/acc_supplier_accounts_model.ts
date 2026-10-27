import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerAccount } from './acc_customers_accounts_model';

@Table({
  tableName: 'account_supplier_account',
  timestamps: true,
  paranoid: false,
})
export class SupplierAccount extends Model<SupplierAccount> {
  @ApiProperty({ example: 1 })
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ApiProperty({ example: 'SUP1889198' })
  @Index({ unique: true })
  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare code: string;

  @ApiProperty({ example: 'Riva Steel Mils' })
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare name: string;

  @ApiPropertyOptional({ example: 'Riva Steel Mils Ltd.' })
  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare businessOrganization: string | null;

  @ApiPropertyOptional({ example: 'supplier@example.com' })
  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare email: string | null;

  @ApiPropertyOptional({ example: '01312345695' })
  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare phoneMobile: string | null;

  @ApiPropertyOptional({ example: 'Motijheel, Dhaka' })
  @AllowNull(true)
  @Column(DataType.TEXT)
  declare address: string | null;

  @ApiPropertyOptional({ example: 50000 })
  @AllowNull(true)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  declare creditLimit: number;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @AllowNull(true)
  @Column(DataType.DATEONLY)
  declare dueDate: string | null;

  @ApiPropertyOptional({ example: 'Sundry Creditors' })
  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare under: string | null;

  @ApiPropertyOptional({ example: 1 })
  @ForeignKey(() => CustomerAccount)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare customerAccountId: number | null;

  @BelongsTo(() => CustomerAccount, {
    foreignKey: 'customerAccountId',
    as: 'customerAccount',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  declare customerAccount: CustomerAccount;

  @ApiProperty({ example: '2026-10-27T15:11:13.320Z' })
  declare createdAt: Date;

  @ApiProperty({ example: '2026-10-27T15:11:13.320Z' })
  declare updatedAt: Date;
}