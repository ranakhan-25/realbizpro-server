import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class JunkLeadActionDto {
  @ApiPropertyOptional({ type: [Number], example: [12, 13] })
  @IsOptional() @IsArray() @ArrayMinSize(1) @Type(() => Number) @IsInt({ each: true }) @Min(1, { each: true })
  declare ids?: number[];

  @ApiPropertyOptional({ type: [String], description: 'Lead UUIDs selected from the frontend' })
  @IsOptional() @IsArray() @ArrayMinSize(1) @IsUUID(undefined, { each: true })
  declare uuids?: string[];

  @ApiPropertyOptional({ description: 'Reason/note for marking leads as junk' })
  @IsOptional() @IsString() declare note?: string;
}
