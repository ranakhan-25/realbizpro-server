import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRequirementTypeDto {
  @ApiProperty({ example: 'Used', maxLength: 150 })
  @IsString() @IsNotEmpty() @MaxLength(150)
  declare name: string;
}
