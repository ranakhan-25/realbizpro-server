import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class DealNegotiationNoteDto {
  @ApiPropertyOptional({ description: 'Approval or rejection note' }) @IsOptional() @IsString() @MaxLength(5000) declare note?: string;
}

export class ReassignDealNegotiationDto {
  @ApiProperty({ description: 'UUID of the active user to receive the lead assignment' }) @IsUUID() declare userId: string;
  @ApiPropertyOptional({ description: 'Reassignment note' }) @IsOptional() @IsString() @MaxLength(5000) declare note?: string;
}
