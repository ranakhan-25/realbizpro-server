import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTechnicianDto {
  @ApiProperty({ description: 'Technician primary key ID to assign', example: 1 })
  @IsNotEmpty()
  @IsInt()
  technician_id: number;
}

