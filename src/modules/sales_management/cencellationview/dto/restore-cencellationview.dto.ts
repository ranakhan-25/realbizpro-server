import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RestoreCancellationDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  uuid: string;
}
