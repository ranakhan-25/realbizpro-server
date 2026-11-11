import { PartialType, ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateCancellationDto } from './create-cencellationview.dto';
import { CancellationStatus } from '../../../../database/models/sales_management/sm_cencellationview.model';

export class UpdateCancellationDto extends PartialType(CreateCancellationDto) {
  @ApiPropertyOptional({
    enum: CancellationStatus,
    description: 'Update processing status',
  })
  @IsOptional()
  @IsEnum(CancellationStatus)
  override status?: CancellationStatus;

  @ApiPropertyOptional({ example: 'Approver - Sadia' })
  @IsOptional()
  @IsString()
  override processedBy?: string;
}
