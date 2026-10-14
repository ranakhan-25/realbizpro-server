import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateInvStockTransferDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ default: 'Pending' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  from_project_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  to_project_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  from_site_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  to_site_id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  item_id: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdBy?: string;
}
