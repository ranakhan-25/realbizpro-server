import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
} from 'class-validator';
import { StatusEnumD } from '@/database/enum/status.enum';

export class UpdateHrmMobileAuthFaceDto {
  @ApiPropertyOptional({
    enum: StatusEnumD,
    example: StatusEnumD.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StatusEnumD)
  status?: StatusEnumD;
}
