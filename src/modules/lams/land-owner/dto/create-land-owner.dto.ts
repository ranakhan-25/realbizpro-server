import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLandOwnerDto {
  @ApiProperty({ description: 'UUID of the associated acquisition lead', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  @ApiProperty({ description: 'Owner or Broker', example: 'Owner' })
  @IsString()
  @IsNotEmpty()
  owner_type: string;

  @ApiProperty({ description: 'Full name of the owner/broker', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Contact number', example: '01711223344' })
  @IsString()
  @IsOptional()
  contact_number?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'john@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Physical address', example: '123 Main St, Dhaka' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'National ID number', example: '1234567890' })
  @IsString()
  @IsOptional()
  nid_number?: string;

  @ApiPropertyOptional({ description: 'Percentage of ownership', example: 50.0 })
  @IsNumber()
  @IsOptional()
  ownership_percentage?: number;

  @ApiPropertyOptional({ description: 'Optional project identifier', example: 'PRJ-1001' })
  @IsString()
  @IsOptional()
  org_id?: string;
}
