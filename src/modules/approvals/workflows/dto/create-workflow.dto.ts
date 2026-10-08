import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty({
    example: 'Leave Request Approval',
    description:
      'Workflow name (Leave, PR, PO, etc.)',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  workflowName: string;

  @ApiProperty({
    example: 'leave_request_workflow',
    description:
      'Unique slug identifier for URL routing',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({
    example: 'dept_id,amount,grade,buyer_id',
    description:
      'Session variables (comma-separated): dept_id, amount, grade, buyer_id, etc.',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sessionVariable?: string;

  @ApiPropertyOptional({
    example: 1,
    description:
      'Draft status ID (status when workflow is created but not submitted)',
  })
  @IsOptional()
  @IsNumber()
  draftStatusId?: number;

  @ApiPropertyOptional({
    example: 2,
    description:
      'Initiate approve status ID (status when approval process starts)',
  })
  @IsOptional()
  @IsNumber()
  initiateApproveStatusId?: number;

  @ApiPropertyOptional({
    example: 3,
    description:
      'After approve status ID (final status after all approvals)',
  })
  @IsOptional()
  @IsNumber()
  afterApproveStatusId?: number;

  //afterRejectStatusId
  @ApiPropertyOptional({
    example: 5,
    description:
      'After reject status ID (status when any step is rejected)',
  })
  @IsOptional()
  @IsNumber()
  afterRejectStatusId?: number;

  @ApiPropertyOptional({
    example: 4,
    description:
      'After decline status ID (status when any step is rejected)',
  })
  @IsOptional()
  @IsNumber()
  afterDeclineStatusId?: number;

  @ApiPropertyOptional({
    example: 'hr_leave_requests',
    description:
      'Reference table name (entity being approved)',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  refDbTableName?: string;

  @ApiPropertyOptional({
    example: 'id',
    description:
      'Reference ID field name in the reference table',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  refIdField?: string;

  @ApiPropertyOptional({
    example: 'status',
    description:
      'Reference status field name in the reference table',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  refStatusField?: string;

  @ApiPropertyOptional({
    example:
      'https://api.example.com/webhooks/leave-approved',
    description:
      'Callback URL to trigger after final approval',
    maxLength: 255,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  callbackUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the workflow is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
