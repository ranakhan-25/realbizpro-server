import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInvUnitDto {
  @ApiProperty({ description: 'The unique code for the unit', example: 'KG' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'The display name of the unit', example: 'Kilogram' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
