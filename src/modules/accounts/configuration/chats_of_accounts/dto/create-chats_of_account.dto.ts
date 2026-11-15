import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsUUID, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChartOfAccountDto {
  // ✅ শুধুমাত্র ভ্যালিড UUID থাকলে চেক করবে
  @ValidateIf((o) => o.chartOfGroupUuid !== null && o.chartOfGroupUuid !== undefined && o.chartOfGroupUuid !== '')
  @IsUUID()
  @IsOptional()
  chartOfGroupUuid?: string;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  openingBalance?: number;

  @IsString()
  under: string;

  @IsBoolean()
  @IsOptional()
  hasDelete?: boolean;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

}