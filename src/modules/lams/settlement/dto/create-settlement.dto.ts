import { ApiProperty } from '@nestjs/swagger';

export class CreateSettlementDto {
  @ApiProperty({ description: 'Acquisition Lead UUID' })
  lead_id: string;

  @ApiProperty({ required: false, description: 'Landowner UUID' })
  owner_id?: string;

  @ApiProperty({ default: 0, description: 'Total agreed settlement amount' })
  agreed_amount: number;

  @ApiProperty({ default: 0, description: 'Advance amount disbursed' })
  advance_amount: number;

  @ApiProperty({ default: 0, description: 'Total paid to date' })
  paid_amount: number;

  @ApiProperty({ default: 0, description: 'Outstanding due balance' })
  due_amount: number;

  @ApiProperty({ default: 'bank_transfer', description: 'Mode of settlement payment' })
  payment_mode: string;

  @ApiProperty({ required: false, description: 'Scheduled date of execution / settlement' })
  scheduled_at?: Date;

  @ApiProperty({ default: 'pending', description: 'Settlement status' })
  status: string;

  @ApiProperty({ required: false, description: 'Dynamic installment schedule breakdown JSON' })
  payment_schedule?: any;

  @ApiProperty({ required: false, description: 'Execution notes or deed remarks' })
  notes?: string;

  @ApiProperty({ required: false, description: 'Organization ID' })
  org_id?: string;
}
