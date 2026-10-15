import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeListDto } from './create-employee-list.dto';

export class UpdateEmployeeListDto extends PartialType(
  CreateEmployeeListDto,
) {}
