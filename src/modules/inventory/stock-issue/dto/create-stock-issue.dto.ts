import { ApiProperty } from '@nestjs/swagger';

export class CreateStockIssueDto {
  @ApiProperty({ required: false, description: 'Generated issue voucher code' })
  issue_code?: string;

  @ApiProperty({ required: false, description: 'Source Warehouse ID' })
  warehouse_id?: number;

  @ApiProperty({ description: 'Inventory Item UUID' })
  item_id: string;

  @ApiProperty({ default: 0, description: 'Quantity issued' })
  quantity: number;

  @ApiProperty({ required: false, description: 'Issued to person / contractor / project site' })
  issued_to?: string;

  @ApiProperty({ required: false, description: 'Reference type (project, work_order, maintenance)' })
  ref_type?: string;

  @ApiProperty({ required: false, description: 'Reference ID or code' })
  ref_id?: string;

  @ApiProperty({ required: false, description: 'Transaction photo / challan URL' })
  photo_url?: string;

  @ApiProperty({ required: false, description: 'Date of issue (YYYY-MM-DD)' })
  date?: Date;

  @ApiProperty({ required: false, description: 'Notes or issue remarks' })
  notes?: string;

  @ApiProperty({ required: false, description: 'Organization ID' })
  org_id?: string;
}
