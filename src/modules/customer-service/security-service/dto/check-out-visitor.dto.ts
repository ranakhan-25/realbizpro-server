import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CheckOutVisitorDto {
  @ApiPropertyOptional({ description: 'Check-out timestamp (defaults to current time if omitted)' })
  @IsOptional()
  @IsDateString()
  out_time?: string;

  @ApiPropertyOptional({ description: 'Exit notes or remarks', example: 'Left building peacefully' })
  @IsOptional()
  @IsString()
  remarks?: string;
}

