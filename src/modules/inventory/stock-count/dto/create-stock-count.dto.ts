import { ApiProperty } from '@nestjs/swagger';

export class CreateStockCountDto {
  @ApiProperty({ required: false, description: 'Warehouse ID' })
  warehouse_id?: number;

  @ApiProperty({ required: false, description: 'Date of count (YYYY-MM-DD)' })
  counted_at?: Date;

  @ApiProperty({ default: 'draft', description: 'Count status (draft, completed, verified)' })
  status?: string;

  @ApiProperty({ required: false, description: 'Notes or remarks' })
  note?: string;

  @ApiProperty({ required: false, description: 'Inventory count items lines JSON' })
  lines_json?: any;

  @ApiProperty({ required: false, description: 'Organization ID' })
  org_id?: string;
}
