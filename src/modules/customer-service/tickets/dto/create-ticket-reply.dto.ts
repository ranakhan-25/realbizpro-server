import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketReplyDto {
  @ApiProperty({
    description: 'Reply message or status update text',
    example: 'Technician visited site. Rectification is in progress.',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Sender role title',
    example: 'Customer Service Lead',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'Optional status change alongside the reply',
    example: 'In Progress',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
