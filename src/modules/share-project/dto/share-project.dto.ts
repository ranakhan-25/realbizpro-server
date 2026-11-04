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
  @ApiProperty({ required: false }) @IsOptional() @IsString() creatorName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() creatorEmail?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() creatorPhone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() companyName?: string;
}

export class PublicCreateShareProjectDto {
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
  @ApiProperty() @IsString() @IsNotEmpty() creatorName: string;
  @ApiProperty() @IsString() @IsNotEmpty() creatorEmail: string;
  @ApiProperty() @IsString() @IsNotEmpty() creatorPhone: string;
  @ApiProperty() @IsString() @IsNotEmpty() creatorPassword: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() companyName?: string;
}

export class PublicInvestmentRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() projectUuid: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() email: string;
  @ApiProperty() @IsString() @IsNotEmpty() password: string;
  @ApiProperty() @IsString() @IsNotEmpty() phone: string;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) quantity: number;
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
