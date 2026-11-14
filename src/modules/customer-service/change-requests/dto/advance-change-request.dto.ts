import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class AdvanceChangeRequestDto {
  @ApiPropertyOptional({
    description:
      'Approval notes or comments when advancing to the next stage',
    example:
      'Verified all title deed documentation; forwarded to HOD for sign-off.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
