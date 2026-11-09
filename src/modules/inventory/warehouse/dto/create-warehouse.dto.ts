import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({ description: 'Warehouse unique code (e.g. WH-01, CEN-WH)' })
  code: string;

  @ApiProperty({ description: 'Warehouse display name' })
  name: string;

  @ApiProperty({ required: false, description: 'Physical address / site location' })
  location?: string;

  @ApiProperty({ default: 'central', description: 'Warehouse type (central, site, transit)' })
  type?: string;

  @ApiProperty({ default: true, description: 'Is warehouse active' })
  is_active?: boolean;

  @ApiProperty({ required: false, description: 'Organization ID' })
  org_id?: string;
}
