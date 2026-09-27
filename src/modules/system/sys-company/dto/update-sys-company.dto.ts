import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-sys-company.dto';

export class UpdateCompanyDto extends PartialType(
  CreateCompanyDto,
) {}
