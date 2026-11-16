import { PartialType } from '@nestjs/swagger';
import { CreateDlpClaimDto } from './create-dlp-claim.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DlpClaimStatus } from 'src/database/models/customer-service/cs_property_care.types';

export class UpdateDlpClaimDto extends PartialType(CreateDlpClaimDto) {
  @ApiPropertyOptional({ enum: DlpClaimStatus })
  @IsOptional()
  @IsEnum(DlpClaimStatus)
  status?: DlpClaimStatus;

  @ApiPropertyOptional({ description: 'Signed off date-time string' })
  @IsOptional()
  @IsString()
  signed_off_at?: string;
}
