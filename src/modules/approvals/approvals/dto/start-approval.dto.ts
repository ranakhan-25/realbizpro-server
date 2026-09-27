import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class StartApprovalDto {
  //workflow slug
  @ApiProperty({
    example: 'leave_approval_workflow',
    description:
      'Workflow slug to use for approval',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  workflowSlug: string;

  @ApiProperty({
    example: 123,
    description:
      'Reference ID from source table (leave_id, po_id, etc.)',
  })
  @IsNotEmpty()
  @IsNumber()
  referenceId: number;

  @ApiPropertyOptional({
    example: 'Urgent leave for family reason',
    description:
      'Remarks or notes about the request',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
