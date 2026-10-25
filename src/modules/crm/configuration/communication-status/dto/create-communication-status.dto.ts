import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { CommunicationStatusState } from 'src/database/models/crm/configuration/crm-communication-status.model';

export class CreateCommunicationStatusDto {
  @ApiProperty({ example: 'Document Follow-up', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ enum: CommunicationStatusState, default: CommunicationStatusState.ACTIVE })
  @IsOptional()
  @IsEnum(CommunicationStatusState)
  status?: CommunicationStatusState = CommunicationStatusState.ACTIVE;

  @ApiPropertyOptional({ example: 'Follow up after documents are submitted' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isDefault?: boolean = false;

  @ApiPropertyOptional({ description: 'Related lead stage UUID' })
  @IsOptional()
  @IsUUID()
  leadStageId?: string;

  @ApiPropertyOptional({ description: 'User who added this record' })
  @IsOptional()
  @IsString()
  addedById?: string;
}
