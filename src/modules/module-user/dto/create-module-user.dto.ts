import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateModuleUserDto {
  @ApiProperty({
    description:
      'The ID of the user to whom modules will be assigned.',
    example: 15,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description:
      'An array of module IDs to assign to the user.',
    example: [1, 3],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  moduleIds: number[];
}
