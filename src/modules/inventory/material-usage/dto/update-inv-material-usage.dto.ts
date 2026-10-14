import { PartialType } from '@nestjs/swagger';
import { CreateInvMaterialUsageDto } from './create-inv-material-usage.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateInvMaterialUsageDto extends PartialType(CreateInvMaterialUsageDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
