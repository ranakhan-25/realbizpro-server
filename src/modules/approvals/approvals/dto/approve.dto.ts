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

export class ApproveDto {
  @ApiProperty({
    example: 123,
    description: 'Approval request ID',
  })
  @IsNotEmpty()
  @IsNumber()
  requestId: number;

  @ApiPropertyOptional({
    example: 'Looks good, approved',
    description: 'Approval comments',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comments?: string;

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
