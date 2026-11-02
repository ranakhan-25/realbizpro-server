import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ShareProjectAssetDto {
  @IsString() url: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() altText?: string;
  @IsOptional() @IsString() fileType?: string;
  @IsOptional() @IsInt() sortOrder?: number;
}

export class CreateShareProjectDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsInt() categoryId: number;
  @ApiProperty() @IsString() @IsNotEmpty() description: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() location?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() thumbnailUrl?: string;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) totalInvestmentAmount: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) totalShares: number;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) pricePerShare: number;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) minimumInvestment: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() expectedAnnualReturn?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() images?: ShareProjectAssetDto[];
  @ApiProperty({ required: false }) @IsOptional() @IsArray() documents?: ShareProjectAssetDto[];
}

export class UpdateShareProjectDto extends CreateShareProjectDto {}

export class RejectShareProjectDto {
  @ApiProperty() @IsString() @IsNotEmpty() reason: string;
}

export class CreateShareProjectCategoryDto {
  @ApiProperty() @IsString() @IsNotEmpty() code: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isActive?: boolean;
}

export class UpdateShareProjectCategoryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() code?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isActive?: boolean;
}
