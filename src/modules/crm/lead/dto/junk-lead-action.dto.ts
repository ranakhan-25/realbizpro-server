import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class JunkLeadActionDto {
  @ApiProperty({ type: [Number], example: [12, 13] })
  @IsArray() @ArrayMinSize(1) @Type(() => Number) @IsInt({ each: true }) @Min(1, { each: true })
  declare ids: number[];

  @ApiPropertyOptional({ description: 'Reason/note for marking leads as junk' })
  @IsOptional() @IsString() declare note?: string;
}
