import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project-type.dto';

export class UpdateProjectDto extends PartialType(
  CreateProjectDto,
) {}
