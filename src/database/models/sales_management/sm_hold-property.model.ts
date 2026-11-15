/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

export enum HoldStatus {
  ACTIVE = 'Active',
  RELEASED = 'Released',
  EXPIRED = 'Expired',
}

export interface HoldPropertyAttributes {
  uuid?: string;
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  
  holdUntil: Date;
  reason: string;
  branch: string;
  
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  
  tokenAmount?: number;
  reference?: string;
  notes?: string;
  
  status: HoldStatus;
  
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface HoldPropertyCreationAttributes extends Omit<HoldPropertyAttributes, 'uuid'> {}
export interface HoldPropertyUpdateAttributes extends Partial<HoldPropertyAttributes> {}

@Table({
  tableName: 'hold_property',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class HoldProperty
  extends BaseModel<HoldPropertyUpdateAttributes, HoldPropertyCreationAttributes>
  implements HoldPropertyAttributes
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

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'property_price' })
  declare propertyPrice: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'hold_until' })
  declare holdUntil: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  declare reason: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare branch: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_name' })
  declare buyerName?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_email' })
  declare buyerEmail?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_phone' })
  declare buyerPhone?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, field: 'token_amount', defaultValue: 0 })
  declare tokenAmount?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare reference?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  @Column({
    type: DataType.ENUM(...Object.values(HoldStatus)),
    allowNull: false,
    defaultValue: HoldStatus.ACTIVE,
  })
  declare status: HoldStatus;

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