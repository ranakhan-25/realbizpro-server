/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

export enum DiscountType {
  PERCENT = 'percent',
  FLAT = 'flat',
}

export interface DiscountAttributes {
  uuid?: string;
  propertyId: string;
  propertyName: string;
  
  discountType: DiscountType;
  discountValue: number;
  reason: string;
  
  audience?: string;
  maxUses?: number;
  minPurchase?: number;
  
  startDate: Date;
  endDate: Date;
  
  couponCode?: string;
  notes?: string;
  
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface DiscountCreationAttributes extends Omit<DiscountAttributes, 'uuid'> {}
export interface DiscountUpdateAttributes extends Partial<DiscountAttributes> {}

@Table({
  tableName: 'discount',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Discount
  extends BaseModel<DiscountUpdateAttributes, DiscountCreationAttributes>
  implements DiscountAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'property_id' })
  declare propertyId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'property_name' })
  declare propertyName: string;

  @Column({
    type: DataType.ENUM(...Object.values(DiscountType)),
    allowNull: false,
    defaultValue: DiscountType.PERCENT,
    field: 'discount_type',
  })
  declare discountType: DiscountType;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'discount_value' })
  declare discountValue: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare reason: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare audience?: string;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0, field: 'max_uses' })
  declare maxUses?: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, defaultValue: 0, field: 'min_purchase' })
  declare minPurchase?: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'start_date' })
  declare startDate: Date;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'end_date' })
  declare endDate: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'coupon_code' })
  declare couponCode?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  // Audit Fields
  @Column({ type: DataType.STRING, allowNull: true, field: 'added_by' })
  declare addedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'added_by_id' })
  declare addedById?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}