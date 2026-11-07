import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export enum OfferStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateOfferDto {
  @ApiProperty({ example: '10% on booking money', maxLength: 200 })
  @IsString() @IsNotEmpty() @MaxLength(200)
  declare name: string;

  @ApiProperty({ enum: OfferStatus, example: OfferStatus.ACTIVE })
  @IsEnum(OfferStatus)
  declare status: OfferStatus;

  @ApiPropertyOptional({ example: 'Every flat gets 10% discount on booking money' })
  @IsOptional() @IsString()
  declare description?: string;

  @ApiPropertyOptional({ description: 'UUID or display name of the user adding this offer' })
  @IsOptional() @IsString()
  declare createdBy?: string;

  @ApiPropertyOptional({ description: 'Existing project identifier, if applicable' })
  @IsOptional() @IsString()
  declare projectId?: string;

  @ApiPropertyOptional({ type: Number, description: 'Organization ID' })
  @IsOptional()
  declare orgId?: number;
}
