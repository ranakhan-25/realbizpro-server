import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectTypeDto {
  // Optional: na dile model hook auto-generate korbe (P + 7 digit)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}