import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVisitPlaceDto {
  @ApiProperty({ example: 'Project Visit', maxLength: 150 })
  @IsString() @IsNotEmpty() @MaxLength(150)
  declare name: string;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional() @IsString() @MaxLength(255)
  declare address?: string;

  @ApiPropertyOptional({ maxLength: 150 })
  @IsOptional() @IsString() @MaxLength(150)
  declare contactPerson?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional() @IsString() @MaxLength(50)
  declare contactNumber?: string;
}
