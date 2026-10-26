import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsString, MinLength } from 'class-validator';
import { CrmPartyCommunicationChannel, CrmPartyCommunicationDirection } from 'src/database/models/crm/lead/crm-party-communication.model';
export class CreateCrmPartyCommunicationDto {
  @ApiProperty({ enum: CrmPartyCommunicationChannel, example: CrmPartyCommunicationChannel.CALL }) @IsEnum(CrmPartyCommunicationChannel) declare channel: CrmPartyCommunicationChannel;
  @ApiProperty({ enum: CrmPartyCommunicationDirection, example: CrmPartyCommunicationDirection.OUTBOUND }) @IsEnum(CrmPartyCommunicationDirection) declare direction: CrmPartyCommunicationDirection;
  @ApiProperty({ format: 'date-time', example: '2026-10-26T06:32:00.000Z' }) @Type(() => Date) @IsDate() declare occurredAt: Date;
  @ApiProperty({ example: 'Discussed the project requirements and next steps.' }) @IsString() @MinLength(1) declare summary: string;
}
