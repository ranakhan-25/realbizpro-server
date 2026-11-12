import { PartialType } from '@nestjs/swagger';
import { CreateAgreementDto } from './create-agreementview.dto';

export class UpdateAgreementDto extends PartialType(CreateAgreementDto) {}
