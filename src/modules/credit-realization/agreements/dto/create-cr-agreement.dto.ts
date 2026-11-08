import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateCrSaleAgreementDto {
  @ApiProperty({ example: 'AGR-2026-0042', description: 'Unique agreement reference number' })
  @IsString()
  @IsNotEmpty()
  agreement_number: string;

  @ApiProperty({ example: 'CUST-0089', description: 'Customer identifier / UUID' })
  @IsString()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty({ example: 'Dr. Shahabuddin Ahmed', description: 'Customer Name' })
  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @ApiPropertyOptional({ example: '+8801711223344' })
  @IsString()
  @IsOptional()
  customer_phone?: string;

  @ApiProperty({ example: 'plot', enum: ['plot', 'flat', 'commercial'] })
  @IsString()
  @IsNotEmpty()
  property_type: string;

  @ApiProperty({ example: 'Plot # 12, Block C', description: 'Plot/Flat identification' })
  @IsString()
  @IsNotEmpty()
  unit_identifier: string;

  @ApiProperty({ example: 4500000, description: 'Total agreed price' })
  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @ApiPropertyOptional({ example: 1000000, description: 'Down payment' })
  @IsNumber()
  @IsOptional()
  down_payment?: number;

  @ApiPropertyOptional({ example: 500000, description: 'Booking money' })
  @IsNumber()
  @IsOptional()
  booking_money?: number;

  @ApiProperty({ example: '2026-10-01', description: 'Agreement date (YYYY-MM-DD)' })
  @IsDateString()
  agreement_date: string;

  @ApiPropertyOptional({ example: '2029-10-01' })
  @IsDateString()
  @IsOptional()
  handover_date?: string;

  @ApiPropertyOptional({ example: 24, description: 'Auto-generate number of installments' })
  @IsNumber()
  @IsOptional()
  number_of_installments?: number;

  @ApiPropertyOptional({ example: 'Standard terms applied' })
  @IsString()
  @IsOptional()
  terms_and_conditions?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  org_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrSaleAgreementDto extends PartialType(CreateCrSaleAgreementDto) {}

export class CreateCrPlotDistributionDto {
  @ApiProperty({ example: 'Plot-12-C' })
  @IsString()
  @IsNotEmpty()
  plot_no: string;

  @ApiPropertyOptional({ example: 'Road 5' })
  @IsString()
  @IsOptional()
  road_no?: string;

  @ApiPropertyOptional({ example: 'Block C' })
  @IsString()
  @IsOptional()
  sector_block?: string;

  @ApiPropertyOptional({ example: 5.0 })
  @IsNumber()
  @IsOptional()
  plot_size_katha?: number;

  @ApiPropertyOptional({ example: 'South-East Corner' })
  @IsString()
  @IsOptional()
  facing?: string;

  @ApiPropertyOptional({ example: 'provisional', enum: ['provisional', 'confirmed', 'registered', 'handed_over'] })
  @IsString()
  @IsOptional()
  allotment_status?: string;

  @ApiPropertyOptional({ example: 'AL-2026-99' })
  @IsString()
  @IsOptional()
  allotment_letter_no?: string;

  @ApiPropertyOptional({ example: '2026-10-15' })
  @IsDateString()
  @IsOptional()
  allotment_date?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  org_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}
