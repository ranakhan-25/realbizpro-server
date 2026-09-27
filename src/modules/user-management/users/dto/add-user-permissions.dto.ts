import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';

export class AddUserPermissionsDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  userId: number;

  //moduleId
  @ApiProperty({
    description: 'Module ID',
    example: 2,
  })
  @IsNumber()
  moduleId: number;

  @ApiProperty({
    description:
      'Array of permission IDs to add to the user',
    example: [5, 6, 7],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}
