import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PartyBusinessType, PartyStatus, PartyType } from 'src/database/models/procurement/parties/party.model';

export class PartyDocumentDto {
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty() @IsString() @IsNotEmpty() file: string;
}

export class CreatePartyDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty({ enum: PartyType }) @IsEnum(PartyType) type: PartyType;
  @ApiPropertyOptional() @IsOptional() @IsString() contactPerson?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional({ default: true }) @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() state?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsapp?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tradeLicenseNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() tradeLicenseExpiry?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nidNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tinNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() binNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerName?: string;
  @ApiPropertyOptional({ enum: PartyBusinessType }) @IsOptional() @IsEnum(PartyBusinessType) businessType?: PartyBusinessType;
  @ApiPropertyOptional() @IsOptional() @IsString() bankName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accountNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() branch?: string;
  @ApiPropertyOptional({ description: 'Accounting group name/key; linked to the accounting master when available.' }) @IsOptional() @IsString() accountingGroup?: string;
  @ApiPropertyOptional({ description: 'Payable account name/key; linked to the chart of accounts when available.' }) @IsOptional() @IsString() payableAccount?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional({ enum: PartyStatus }) @IsOptional() @IsEnum(PartyStatus) status?: PartyStatus;
  @ApiPropertyOptional({ type: [PartyDocumentDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => PartyDocumentDto) documents?: PartyDocumentDto[];
  @ApiPropertyOptional({ example: 1, description: 'Organization ID' })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;
}

export class UpdatePartyDto extends PartialType(CreatePartyDto) {}

export class PartyQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ enum: PartyType }) @IsOptional() @IsEnum(PartyType) type?: PartyType;
  @ApiPropertyOptional({ enum: PartyStatus }) @IsOptional() @IsEnum(PartyStatus) status?: PartyStatus;
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional({ default: 10 }) @IsOptional() @Type(() => Number) limit?: number;
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' }) @IsOptional() @IsEnum(['ASC', 'DESC']) sortOrder?: 'ASC' | 'DESC';
}
