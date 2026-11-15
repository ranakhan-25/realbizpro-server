/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

export interface PropertyPricingAttributes {
  uuid?: string;
  propertyId: string;
  propertyName: string;
  
  basePrice: number;
  retailPrice: number;
  investorPrice: number;
  vipPrice: number;
  
  taxPercent: number;
  discountPercent: number;
  bookingFee: number;
  
  effectiveDate?: Date;
  notes?: string;
  
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface PropertyPricingCreationAttributes extends Omit<PropertyPricingAttributes, 'uuid'> {}
export interface PropertyPricingUpdateAttributes extends Partial<PropertyPricingAttributes> {}

@Table({
  tableName: 'property_pricing',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class PropertyPricing
  extends BaseModel<PropertyPricingUpdateAttributes, PropertyPricingCreationAttributes>
  implements PropertyPricingAttributes
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

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'base_price' })
  declare basePrice: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'retail_price' })
  declare retailPrice: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'investor_price' })
  declare investorPrice: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'vip_price' })
  declare vipPrice: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, defaultValue: 0, field: 'tax_percent' })
  declare taxPercent: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, defaultValue: 0, field: 'discount_percent' })
  declare discountPercent: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'booking_fee' })
  declare bookingFee: number;

  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'effective_date' })
  declare effectiveDate?: Date;

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