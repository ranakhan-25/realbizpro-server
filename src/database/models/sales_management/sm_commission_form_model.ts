import {
  Table, Column, Model, DataType, PrimaryKey, Default,
  CreatedAt, UpdatedAt, DeletedAt, ForeignKey, BelongsTo, Index
} from 'sequelize-typescript';
import { Agent } from './sm_commission_form_agent_model';

export enum CommissionType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
}

export enum PropertyType {
  RESIDENTIAL_LAND = 'Residential Land',
  APARTMENT = 'Apartment',
  COMMERCIAL = 'Commercial',
  VILLA = 'Villa',
  RENTAL = 'Rental',
}

@Table({ tableName: 'commissionsform', timestamps: true, paranoid: true, underscored: true })
export class Commission extends Model<Commission> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Column({ type: DataType.UUID, field: 'id' })
  declare uuid: string;

  @ForeignKey(() => Agent)
  @Index
  @Column({ type: DataType.UUID, allowNull: false, field: 'agent_id' })
  declare agentUuid: string;

  @BelongsTo(() => Agent, { foreignKey: 'agentId', as: 'agent' })
  declare agent?: Agent;

  @Column({
    type: DataType.ENUM(...Object.values(PropertyType)),
    allowNull: false,
    field: 'property_type',
  })
  declare propertyType: PropertyType;

  @Column({
    type: DataType.ENUM(...Object.values(CommissionType)),
    allowNull: false,
    defaultValue: CommissionType.PERCENTAGE,
    field: 'commission_type',
  })
  declare commissionType: CommissionType;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true, field: 'base_amount' })
  declare baseAmount: number | null;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: true })
  declare percentage: number | null;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, defaultValue: 0, field: 'min_commission' })
  declare minCommission: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string | null;

  @CreatedAt @Column({ field: 'created_at' }) declare createdAt: Date;
  @UpdatedAt @Column({ field: 'updated_at' }) declare updatedAt: Date;
  @DeletedAt @Column({ field: 'deleted_at' }) declare deletedAt: Date | null;
}
