import {
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import { CreateWorkflowDto } from './create-workflow.dto';
import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateWorkflowDto extends PartialType(
  CreateWorkflowDto,
) {
  @ApiPropertyOptional({
    example: true,
    description: 'Is workflow active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  override isActive?: boolean;
}
