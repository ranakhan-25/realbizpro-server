import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';

export class DeleteUserPermissionsDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description:
      'Array of permission IDs to remove from the user',
    example: [5, 6, 7],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}
