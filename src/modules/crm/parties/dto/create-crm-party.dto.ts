import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CrmPartyStatus, CrmPartyType } from 'src/database/models/crm/lead/crm-party.model';

export class CreateCrmPartyDto {
  @ApiProperty({ example: 'Engr. Kabir Hossain' }) @IsString() @MinLength(1) @MaxLength(200) declare name: string;
  @ApiProperty({ example: '017111998877' }) @IsString() @MinLength(1) @MaxLength(40) declare phone: string;
  @ApiPropertyOptional({ example: 'kabir@example.com' }) @IsOptional() @IsEmail() @MaxLength(200) declare email?: string;
  @ApiPropertyOptional({ example: '1234567890' }) @IsOptional() @IsString() @MaxLength(100) declare nidNumber?: string;
  @ApiProperty({ enum: CrmPartyType, example: CrmPartyType.CUSTOMER }) @IsEnum(CrmPartyType) declare partyType: CrmPartyType;
  @ApiPropertyOptional({ example: 'House 10, Road 5, Dhaka' }) @IsOptional() @IsString() declare address?: string;
  @ApiPropertyOptional({ example: 'VIP Client, Commercial', description: 'Comma-separated tags' }) @IsOptional() @IsString() declare tags?: string;
  @ApiPropertyOptional({ enum: CrmPartyStatus, default: CrmPartyStatus.ACTIVE }) @IsOptional() @IsEnum(CrmPartyStatus) declare status?: CrmPartyStatus;
}
