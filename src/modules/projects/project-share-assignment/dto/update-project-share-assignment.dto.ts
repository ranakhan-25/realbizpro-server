/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateProjectShareAssignmentDto } from './create-project-share-assignment.dto';

export class UpdateProjectShareAssignmentDto extends PartialType(
  CreateProjectShareAssignmentDto,
) {}
