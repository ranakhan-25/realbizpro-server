import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAcquisitionLeadDto {
  @ApiProperty({ description: 'Title of the acquisition lead', example: 'Bashundhara Plot C' })
  @IsString()
  @IsNotEmpty()
  lead_title: string;

  @ApiPropertyOptional({ description: 'Date of the lead', example: '2026-10-07' })
  @IsDateString()
  @IsOptional()
  lead_date?: string;

  @ApiPropertyOptional({ description: 'Type of land', example: 'Commercial' })
  @IsString()
  @IsOptional()
  land_type?: string;

  @ApiPropertyOptional({ description: 'Area of the land in decimals/kathas', example: 5.5 })
  @IsNumber()
  @IsOptional()
  land_area?: number;

  @ApiPropertyOptional({ description: 'Status of the lead', example: 'New' })
  @IsString()
  @IsOptional()
  lead_status?: string;

  @ApiPropertyOptional({ description: 'Optional project identifier', example: 'PRJ-1001' })
  @IsString()
  @IsOptional()
  projectId?: string;
}
