import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { HandoverStatus } from 'src/database/models/customer-service/cs_booking_handover.model';

export class UpdateHandoverStatusDto {
  @ApiProperty({
    description:
      'Target handover lifecycle status',
    enum: HandoverStatus,
    example: HandoverStatus.READY_FOR_SNAGGING,
  })
  @IsEnum(HandoverStatus, {
    message:
      'handover_status must be one of: Under Construction, Ready for Snagging, DLP Active, Handed Over',
  })
  handover_status: HandoverStatus;

  @ApiPropertyOptional({
    description:
      'Possession handover date (YYYY-MM-DD)',
    example: '2026-11-05',
  })
  @IsOptional()
  @IsDateString()
  possession_date?: string;

  @ApiPropertyOptional({
    description:
      'DLP statutory warranty expiry date (YYYY-MM-DD). If omitted, automatically computed as possession_date + 2 years minus 1 day.',
    example: '2028-11-04',
  })
  @IsOptional()
  @IsDateString()
  dlp_expiry_date?: string;

  @ApiPropertyOptional({
    description: 'Key register log code/number',
    example: 'KEY-GUL-A7',
  })
  @IsOptional()
  @IsString()
  key_register_no?: string;

  @ApiPropertyOptional({
    description:
      'Possession certificate sign-off reference number',
    example: 'CERT-POSS-2026-88',
  })
  @IsOptional()
  @IsString()
  possession_cert_no?: string;

  @ApiPropertyOptional({
    description:
      'Total snags/defects reported during joint inspection',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  total_snags_reported?: number;

  @ApiPropertyOptional({
    description:
      'Total snags/defects rectified/resolved',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  total_snags_resolved?: number;

  @ApiPropertyOptional({
    description:
      'Transition audit notes or handover remarks',
    example:
      'Joint inspection completed, all snags verified and resolved, keys handed over.',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
