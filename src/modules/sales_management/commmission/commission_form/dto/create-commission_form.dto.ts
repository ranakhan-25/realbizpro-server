import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,
  IsUUID, Max, MaxLength, Min,
} from 'class-validator';
import { CommissionType, PropertyType } from 'src/database/models/sales_management/sm_commission_form_model';

export class CreateCommissionDto {
  @ApiProperty({ format: 'uuid', description: 'Existing agent UUID. Get valid UUIDs from GET /commissions/agents.' })
  @IsUUID('4')
  @IsNotEmpty()
  agentUuid: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.APARTMENT })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ enum: CommissionType, example: CommissionType.PERCENTAGE })
  @IsEnum(CommissionType)
  commissionType: CommissionType;

  @ApiPropertyOptional({ example: 50000, description: 'Required if type is flat' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  baseAmount?: number;

  @ApiPropertyOptional({ example: 2.5, description: 'Required if type is percentage' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  percentage?: number;

  @ApiPropertyOptional({ example: 25000, default: 0 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minCommission?: number;

  @ApiPropertyOptional({ example: 'Standard rate for apartments' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
