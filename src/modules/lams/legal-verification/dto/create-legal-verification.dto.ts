import { ApiProperty } from '@nestjs/swagger';

export class CreateLegalVerificationDto {
  @ApiProperty({ description: 'Acquisition Lead UUID' })
  lead_id: string;

  @ApiProperty({ required: false, description: 'Assigned lawyer or law firm' })
  lawyer_name?: string;

  @ApiProperty({ default: false, description: 'Is title clear and free of dispute' })
  title_clear: boolean;

  @ApiProperty({ default: false, description: 'Is mutation record verified' })
  mutation_ok: boolean;

  @ApiProperty({ default: false, description: 'Is land tax clearance verified' })
  tax_clear: boolean;

  @ApiProperty({ default: 'in_progress', description: 'Legal verification status' })
  status: string;

  @ApiProperty({ required: false, description: 'Verification date (YYYY-MM-DD)' })
  verified_at?: Date;

  @ApiProperty({ required: false, description: 'Legal opinion / summary' })
  opinion?: string;

  @ApiProperty({ required: false, description: 'Report attachment URL' })
  report_url?: string;

  @ApiProperty({ required: false, description: 'Findings checklist JSON' })
  findings_json?: any;

  @ApiProperty({ required: false, description: 'Organization ID' })
  org_id?: string;
}
