import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RejectDto {
  @ApiProperty({
    example: 123,
    description: 'Approval request ID',
  })
  @IsNotEmpty()
  @IsNumber()
  requestId: number;

  @ApiPropertyOptional({
    example: 'Missing required documents',
    description: 'Rejection reason',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({
    example: '192.168.1.1',
    description: 'IP address for audit trail',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ipAddress?: string;
}
