import { PartialType } from '@nestjs/swagger';
import { CreateSecurityCompanyDto } from './create-security-company.dto';

export class UpdateSecurityCompanyDto extends PartialType(CreateSecurityCompanyDto) {}

