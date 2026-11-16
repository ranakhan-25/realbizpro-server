import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { RosterStatus } from 'src/database/models/customer-service/cs_security.types';

export class UpdateRosterStatusDto {
  @ApiProperty({
    description: 'Updated shift status',
    enum: ['SCHEDULED', 'ON_DUTY', 'COMPLETED', 'ABSENT', 'RELIEVED'],
    example: 'ON_DUTY',
  })
  @IsNotEmpty()
  @IsIn(['SCHEDULED', 'ON_DUTY', 'COMPLETED', 'ABSENT', 'RELIEVED'])
  status: RosterStatus;

  @ApiPropertyOptional({ description: 'Status change or attendance handover notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
