import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date | null;

  @ApiProperty({ required: false })
  createdById?: number;

  @ApiProperty({
    description:
      'Array of role IDs assigned to the user',
    type: [Number],
    required: false,
    default: [],
  })
  roleIds?: number[];

  @ApiProperty({
    description:
      'Array of module IDs assigned to the user',
    type: [Number],
    required: false,
    default: [],
  })
  moduleIds?: number[];
}
