import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class UpdateModuleUserDto {
  @ApiProperty({
    description:
      'The ID of the user whose module assignments will be updated.',
    example: 15,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description:
      'The complete new array of module IDs to assign to the user. This will replace all existing assignments.',
    example: [1, 3, 5],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  moduleIds: number[];
}
