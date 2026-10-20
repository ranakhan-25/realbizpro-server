import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { FlatLandStatus } from 'src/database/models/projects/flatland/pr_flatland.model';

export class CreateFlatLandDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  projectName?: string;

  @ApiPropertyOptional({ enum: ['flat', 'land'], default: 'flat' })
  @IsOptional()
  @IsIn(['flat', 'land'])
  propertyType?: 'flat' | 'land';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  uid?: string;

  @ApiProperty({ example: 'F-4' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  flatLandNo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  siteBlock?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  siteName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  blockName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  roadNo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  roadSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  plotLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  bedroom?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  bathroom?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerUnit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  parkingCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  utilityCharge?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facing?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  amenities?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  drawing?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dining?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kitchen?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  balcony?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parking?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  basement?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  grandTotal?: number;

  @ApiPropertyOptional({ enum: FlatLandStatus })
  @IsOptional()
  @IsEnum(FlatLandStatus)
  status?: FlatLandStatus;
}
