import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';

export class CreateInvMaterialUsageItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  item_id: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CreateInvMaterialUsageDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  company_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  project_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  site_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  task_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  worker_id?: number;

  @ApiProperty({ type: [CreateInvMaterialUsageItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvMaterialUsageItemDto)
  items: CreateInvMaterialUsageItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ example: 'PRJ-1001', description: 'Optional Project Identifier' })
  @IsOptional()
  @IsString()
  projectId?: string;
}
