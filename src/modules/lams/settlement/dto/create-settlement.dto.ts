import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsDateString } from 'class-validator';

export class CreateSettlementDto {
  @ApiProperty({ description: 'Organization ID', example: 'org-001' })
  @IsString()
  @IsNotEmpty()
  org_id: string;

  @ApiProperty({ description: 'Acquisition Lead UUID' })
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @ApiPropertyOptional({ description: 'Landowner UUID' })
  @IsUUID()
  @IsOptional()
  owner_id?: string;

  @ApiPropertyOptional({ default: 0, description: 'Total agreed settlement amount' })
  @IsNumber()
  @IsOptional()
  agreed_amount?: number;

  @ApiPropertyOptional({ default: 0, description: 'Advance amount disbursed' })
  @IsNumber()
  @IsOptional()
  advance_amount?: number;

  @ApiPropertyOptional({ default: 0, description: 'Total paid to date' })
  @IsNumber()
  @IsOptional()
  paid_amount?: number;

  @ApiPropertyOptional({ default: 0, description: 'Outstanding due balance' })
  @IsNumber()
  @IsOptional()
  due_amount?: number;

  @ApiPropertyOptional({ default: 'bank_transfer', description: 'Mode of settlement payment' })
  @IsString()
  @IsOptional()
  payment_mode?: string;

  @ApiPropertyOptional({ description: 'Scheduled date of execution or settlement' })
  @IsDateString()
  @IsOptional()
  scheduled_at?: Date;

  @ApiPropertyOptional({ default: 'pending', description: 'Settlement status' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Dynamic installment schedule breakdown JSON' })
  @IsOptional()
  payment_schedule?: any;

  @ApiPropertyOptional({ description: 'Execution notes or deed remarks' })
  @IsString()
  @IsOptional()
  notes?: string;
}
