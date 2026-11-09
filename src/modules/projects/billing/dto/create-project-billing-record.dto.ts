import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProjectBillingRecordDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: 'Bill item or work order title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  recordDate?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ default: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
