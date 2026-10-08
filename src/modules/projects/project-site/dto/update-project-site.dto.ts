/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateProjectSiteDto } from './create-project-site.dto';

export class UpdateProjectSiteDto extends PartialType(
  CreateProjectSiteDto,
) {}
