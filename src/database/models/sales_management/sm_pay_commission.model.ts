/* eslint-disable prettier/prettier */

import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

export enum PaymentMethod {
  BANK_TRANSFER = 'Bank Transfer',
  CHEQUE = 'Cheque',
}

export interface PayCommissionAttributes {
  uuid?: string;
  agentId: string;
  agentName: string;
  agentRole?: string;
  agentAvatar?: string;

  bankName?: string;
  accountNo?: string;
  branch?: string;

  paymentMethod: PaymentMethod;
  totalAmount: number;

  dealIds?: string;        // comma-separated à¦¬à¦¾ JSON string (pending deals)
  dealBreakdown?: string;  // JSON stringified breakdown [{dealId, property, amount}]

  notes?: string;
  acknowledged: boolean;

  status?: string;         // 'paid' | 'pending' | 'failed'

  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface PayCommissionCreationAttributes
  extends Omit<PayCommissionAttributes, 'uuid'> {}
export interface PayCommissionUpdateAttributes
  extends Partial<PayCommissionAttributes> {}

@Table({
  tableName: 'pay_commission',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class PayCommission
  extends BaseModel<PayCommissionUpdateAttributes, PayCommissionCreationAttributes>
  implements PayCommissionAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'agent_id' })
  declare agentId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'agent_name' })
  declare agentName: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'agent_role' })
  declare agentRole?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'agent_avatar' })
  declare agentAvatar?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'bank_name' })
  declare bankName?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'account_no' })
  declare accountNo?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare branch?: string;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: false,
    defaultValue: PaymentMethod.BANK_TRANSFER,
    field: 'payment_method',
  })
  declare paymentMethod: PaymentMethod;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_amount',
  })
  declare totalAmount: number;

  @Column({ type: DataType.TEXT, allowNull: true, field: 'deal_ids' })
  declare dealIds?: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: 'deal_breakdown' })
  declare dealBreakdown?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare acknowledged: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'paid',
  })
  declare status?: string;

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