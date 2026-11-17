import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdvanceStageDto {
  @ApiProperty({ description: 'Target workflow stage', example: 'Qualified' })
  @IsString()
  @IsNotEmpty()
  to_stage: string;

  @ApiProperty({ description: 'Mandatory justification or remarks for transition', example: 'Title search completed without encumbrance' })
  @IsString()
  @IsNotEmpty()
  remarks: string;

  @ApiPropertyOptional({ description: 'User identifier advancing stage' })
  @IsString()
  @IsOptional()
  transitioned_by?: string;
}

export class RejectLeadDto {
  @ApiProperty({ description: 'Mandatory reason for rejection', example: 'Disputed inheritance and high price gap' })
  @IsString()
  @IsNotEmpty()
  remarks: string;
}
