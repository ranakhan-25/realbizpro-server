import { ApiProperty } from '@nestjs/swagger';

export class CreateApprovalDto {
  @ApiProperty({ description: 'Acquisition Lead UUID' })
  lead_id: string;

  @ApiProperty({ default: 'level_1', description: 'Approval tier (level_1, level_2, committee, board)' })
  level: string;

  @ApiProperty({ required: false, description: 'Approver full name or role title' })
  approver_name?: string;

  @ApiProperty({ default: 'pending', description: 'Decision (pending, approved, rejected, deferred)' })
  decision: string;

  @ApiProperty({ required: false, description: 'Decision comment or vetting remarks' })
  comment?: string;

  @ApiProperty({ required: false, description: 'Decision timestamp' })
  decided_at?: Date;

  @ApiProperty({ default: 'preliminary', description: 'Workflow stage (lead, negotiation, approval, agreement, payment)' })
  stage: string;

  @ApiProperty({ required: false, description: 'Organization ID' })
  org_id?: string;
}
