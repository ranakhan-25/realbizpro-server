import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class UpsertLeadRequirementDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() declare requirementTypeId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() declare propertyType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare preferredArea?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() declare sizeSqft?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() declare budgetMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() declare budgetMax?: number;
  @ApiPropertyOptional({ type: 'array', items: { type: 'string' } }) @IsOptional() declare featuresRequired?: unknown;
  @ApiPropertyOptional() @IsOptional() @IsString() declare remarks?: string;
}

export class UpsertPropertyInterestDto {
  @ApiPropertyOptional({ description: 'Project UUID' }) @IsOptional() @IsString() declare projectId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare projectName?: string;
  @ApiPropertyOptional({ description: 'Flat or land identifier/code' }) @IsOptional() @IsString() declare plotFlatNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare size?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() declare quotedPrice?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() declare clientOfferedPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() declare status?: string;
}

export class CreateNegotiationDto {
  @ApiProperty({ description: 'Project UUID' }) @IsUUID() declare projectId: string;
  @ApiPropertyOptional({ description: 'Flat/land UUID from the project inventory' }) @IsOptional() @IsUUID() declare flatLandId?: string;
  @ApiPropertyOptional({ example: 'offer', enum: ['offer', 'counter_offer'] }) @IsOptional() @IsIn(['offer', 'counter_offer']) declare activityType?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() declare listedPrice?: number;
  @ApiProperty() @Type(() => Number) @IsNumber() declare clientOfferedPrice: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() declare counterPrice?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() declare finalAgreedPrice?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() declare discountAmount?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(100) declare discountPercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() declare paymentTerm?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare specialCondition?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare roundNo?: number;
  @ApiPropertyOptional({ enum: ['pending', 'approved', 'rejected'] }) @IsOptional() @IsIn(['pending', 'approved', 'rejected']) declare status?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() declare createdById?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare note?: string;
}

export class UpdateNegotiationDto extends PartialType(CreateNegotiationDto) {}
