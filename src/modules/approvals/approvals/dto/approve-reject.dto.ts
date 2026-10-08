import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ApproveRejectDto {
  @ApiProperty({
    description: 'Approval request ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  requestId: number;

  @ApiPropertyOptional({
    description: 'Comments for the action',
    example: 'Approved with conditions mentioned',
  })
  @IsOptional()
  @IsString()
  comments?: string;
}
