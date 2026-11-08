import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty() @IsString() @MaxLength(255) declare clientName: string;
  @ApiProperty() @IsString() @MaxLength(30) declare phone: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare leadCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() declare leadDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare alternatePhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() declare email?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare leadCategoryId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare leadStageId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare leadSourceId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare campaignId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare professionId?: number;
  @ApiPropertyOptional({ description: 'Offer UUID associated with this lead' }) @IsOptional() @IsString() declare offerUuid?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare areaId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare priceRangeId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() declare assignedTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare creditOfficerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare designation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare organization?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare presentAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare permanentAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() declare birthDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() declare anniversaryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare leadType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare initialRemark?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare query?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare projectId?: string;
  @ApiPropertyOptional({ description: 'Interested project display name/UUID; saved in the related property interest record' }) @IsOptional() @IsString() declare projectName?: string;
  @ApiPropertyOptional({ example: 1 }) @IsOptional() @Type(() => Number) @IsInt() declare orgId?: number;
}
