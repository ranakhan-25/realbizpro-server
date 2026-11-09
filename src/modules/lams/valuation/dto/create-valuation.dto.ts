import { ApiProperty } from '@nestjs/swagger';

export class CreateValuationDto {
  @ApiProperty({ description: 'Acquisition Lead UUID' })
  lead_id: string;

  @ApiProperty({ required: false, description: 'Valuer / Appraiser Name or ID' })
  valuer_id?: string;

  @ApiProperty({ default: 0, description: 'Market rate per unit' })
  market_rate: number;

  @ApiProperty({ default: 0, description: 'Govt rate per unit' })
  govt_rate: number;

  @ApiProperty({ default: 0, description: 'Total calculated valuation' })
  total_value: number;

  @ApiProperty({ default: 'comparative', description: 'Valuation method' })
  method: string;

  @ApiProperty({ required: false, description: 'Report attachment URL' })
  report_url?: string;

  @ApiProperty({ required: false, description: 'Date of valuation (YYYY-MM-DD)' })
  valued_at?: Date;

  @ApiProperty({ default: 'completed', description: 'Valuation status' })
  status?: string;

  @ApiProperty({ required: false, description: 'Notes or appraisal summary' })
  notes?: string;

  @ApiProperty({ required: false, description: 'Organization ID' })
  org_id?: string;
}
