import { PartialType } from '@nestjs/swagger';
import { CreateProjectShareConfigurationDto } from './create-project-share-configuration.dto';

export class UpdateProjectShareConfigurationDto extends PartialType(
  CreateProjectShareConfigurationDto,
) {}
