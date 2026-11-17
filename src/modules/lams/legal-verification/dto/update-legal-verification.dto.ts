import { PartialType } from '@nestjs/swagger';
import { CreateLegalVerificationDto } from './create-legal-verification.dto';

export class UpdateLegalVerificationDto extends PartialType(CreateLegalVerificationDto) {}
