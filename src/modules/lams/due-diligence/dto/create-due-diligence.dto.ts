import { ApiProperty } from '@nestjs/swagger';

export class CreateDueDiligenceDto {
  @ApiProperty({ description: 'Acquisition Lead UUID' })
  lead_id: string;

  @ApiProperty({ default: 0, description: 'Due diligence score (0-100)' })
  score: number;

  @ApiProperty({ default: 'in_progress', description: 'Due diligence status' })
  status: string;

  @ApiProperty({ required: false, description: 'Surveyor / Inspector name' })
  surveyor_name?: string;

  @ApiProperty({ required: false, description: 'Report attachment URL' })
  report_url?: string;

  @ApiProperty({ required: false, description: 'Physical checklist JSON' })
  checklist_json?: any;

  @ApiProperty({ required: false, description: 'Organization ID' })
  org_id?: string;
}
