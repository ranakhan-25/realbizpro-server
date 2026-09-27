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

export class DelegateDto {
  @ApiProperty({
    example: 123,
    description: 'Approval request ID',
  })
  @IsNotEmpty()
  @IsNumber()
  requestId: number;

  @ApiProperty({
    example: 15,
    description:
      'User ID to delegate approval to',
  })
  @IsNotEmpty()
  @IsNumber()
  delegateToUserId: number;

  @ApiPropertyOptional({
    example: 'On vacation, delegating to John',
    description: 'Delegation reason',
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
