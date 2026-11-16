import { PartialType } from '@nestjs/swagger';
import { CreateSecurityRosterDto } from './create-security-roster.dto';

export class UpdateSecurityRosterDto extends PartialType(CreateSecurityRosterDto) {}

