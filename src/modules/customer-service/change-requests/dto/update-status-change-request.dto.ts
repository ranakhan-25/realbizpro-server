import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ChangeRequestStatus } from 'src/database/models/customer-service/cs_change_request.model';

export class UpdateStatusChangeRequestDto {
  @ApiProperty({
    description: 'Target workflow status',
    enum: ChangeRequestStatus,
    example: ChangeRequestStatus.REJECTED,
  })
  @IsNotEmpty()
  @IsEnum(ChangeRequestStatus)
  status: ChangeRequestStatus;

  @ApiPropertyOptional({
    description:
      'Remarks or justification for status change',
    example:
      'Transferee NID vetting failed due to discrepancies in land office records.',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
